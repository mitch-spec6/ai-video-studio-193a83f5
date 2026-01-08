"""
Video Generation Celery Tasks
"""
import os
import time
from datetime import datetime
from celery import Celery

from app import create_app
from app.extensions import db
from app.models.video import Video, VideoStatus
from app.models.generation_task import GenerationTask
from app.services.text_to_video_service import TextToVideoService

# Initialize Celery
celery_app = Celery(
    'video_tasks',
    broker=os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('REDIS_URL', 'redis://localhost:6379/0')
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=600,  # 10 minutes max
    task_soft_time_limit=540,  # Soft limit at 9 minutes
)


def get_flask_app():
    """Get Flask app context."""
    return create_app()


@celery_app.task(bind=True, max_retries=3)
def generate_video_task(self, video_id: int):
    """
    Main video generation task.
    
    Flow:
    1. Enhance prompt
    2. Generate script if needed
    3. Start video generation
    4. Poll for completion
    5. Post-process
    6. Generate SEO
    7. Update database
    """
    app = get_flask_app()
    
    with app.app_context():
        video = Video.query.get(video_id)
        if not video:
            return {'error': 'Video not found'}
        
        # Update task record
        task_record = GenerationTask.query.filter_by(
            video_id=video_id,
            celery_task_id=self.request.id
        ).first()
        
        if task_record:
            task_record.status = 'processing'
            task_record.started_at = datetime.utcnow()
            db.session.commit()
        
        try:
            # Update video status
            video.status = VideoStatus.PROCESSING.value
            db.session.commit()
            
            # Initialize service
            service = TextToVideoService()
            
            # Generate script if not provided
            if not video.script:
                video.script = service.generate_script(
                    video.prompt,
                    video.style,
                    video.duration
                )
                db.session.commit()
            
            # Start video generation
            result = service.create_video(
                prompt=video.prompt,
                style=video.style,
                duration=video.duration,
                resolution=video.resolution,
                script=video.script
            )
            
            if result.get('error'):
                raise Exception(result['error'])
            
            # Save enhanced prompt
            video.enhanced_prompt = result.get('enhanced_prompt')
            db.session.commit()
            
            # Update task with provider info
            if task_record:
                task_record.provider = result.get('provider')
                task_record.provider_task_id = result.get('task_id')
                db.session.commit()
            
            # Poll for completion
            provider_task_id = result.get('task_id')
            if provider_task_id:
                poll_video_status.delay(video_id, provider_task_id, self.request.id)
            
            return {
                'video_id': video_id,
                'status': 'processing',
                'task_id': provider_task_id
            }
            
        except Exception as e:
            # Handle failure
            video.status = VideoStatus.FAILED.value
            video.error_message = str(e)
            
            if task_record:
                task_record.status = 'failed'
                task_record.error_message = str(e)
                task_record.finished_at = datetime.utcnow()
            
            db.session.commit()
            
            # Retry if applicable
            if self.request.retries < self.max_retries:
                raise self.retry(exc=e, countdown=60 * (self.request.retries + 1))
            
            return {
                'video_id': video_id,
                'status': 'failed',
                'error': str(e)
            }


@celery_app.task(bind=True)
def poll_video_status(self, video_id: int, provider_task_id: str, original_task_id: str):
    """
    Poll provider for video generation status.
    
    Polls every 10 seconds until complete or failed.
    """
    app = get_flask_app()
    
    with app.app_context():
        video = Video.query.get(video_id)
        if not video:
            return {'error': 'Video not found'}
        
        service = TextToVideoService()
        max_polls = 60  # Max 10 minutes of polling
        poll_interval = 10  # seconds
        
        for i in range(max_polls):
            result = service.check_status(provider_task_id)
            status = result.get('status')
            
            if status == 'succeeded':
                # Video is ready
                video.video_url = result.get('video_url')
                video.status = VideoStatus.COMPLETED.value
                
                # Generate SEO if not present
                if not video.seo_title:
                    seo = service.generate_seo(video.prompt, video.script)
                    video.seo_title = seo.get('title')
                    video.seo_description = seo.get('description')
                    video.seo_tags = seo.get('tags', [])
                
                # Update task record
                task_record = GenerationTask.query.filter_by(
                    celery_task_id=original_task_id
                ).first()
                if task_record:
                    task_record.status = 'completed'
                    task_record.progress = 100
                    task_record.finished_at = datetime.utcnow()
                
                db.session.commit()
                
                return {
                    'video_id': video_id,
                    'status': 'completed',
                    'video_url': video.video_url
                }
            
            elif status == 'failed':
                video.status = VideoStatus.FAILED.value
                video.error_message = result.get('error', 'Generation failed')
                
                task_record = GenerationTask.query.filter_by(
                    celery_task_id=original_task_id
                ).first()
                if task_record:
                    task_record.status = 'failed'
                    task_record.error_message = result.get('error')
                    task_record.finished_at = datetime.utcnow()
                
                db.session.commit()
                
                return {
                    'video_id': video_id,
                    'status': 'failed',
                    'error': result.get('error')
                }
            
            else:
                # Still processing - update progress estimate
                task_record = GenerationTask.query.filter_by(
                    celery_task_id=original_task_id
                ).first()
                if task_record:
                    task_record.progress = min(90, (i + 1) * 100 // max_polls)
                    db.session.commit()
                
                time.sleep(poll_interval)
        
        # Timeout
        video.status = VideoStatus.FAILED.value
        video.error_message = 'Generation timed out'
        db.session.commit()
        
        return {
            'video_id': video_id,
            'status': 'failed',
            'error': 'Generation timed out'
        }


@celery_app.task
def cleanup_old_videos():
    """Cleanup old failed videos and temporary files."""
    app = get_flask_app()
    
    with app.app_context():
        from datetime import timedelta
        cutoff = datetime.utcnow() - timedelta(days=7)
        
        # Find old failed videos
        old_failed = Video.query.filter(
            Video.status == VideoStatus.FAILED.value,
            Video.created_at < cutoff
        ).all()
        
        for video in old_failed:
            db.session.delete(video)
        
        db.session.commit()
        
        return {'deleted': len(old_failed)}
