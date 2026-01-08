"""
Video Routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.video import Video, VideoStatus
from app.models.generation_task import GenerationTask
from app.services.text_to_video_service import TextToVideoService
from app.tasks.video_tasks import generate_video_task

video_bp = Blueprint('video', __name__)


@video_bp.route('', methods=['POST'])
@jwt_required()
def create_video():
    """
    Create a new video generation request.
    
    Request body:
    {
        "prompt": "A cinematic shot of a futuristic city at sunset",
        "style": "cinematic",
        "duration": 6,
        "resolution": "1024x576",
        "voice_id": "optional-voice-id",
        "script": "optional-custom-script"
    }
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    prompt = data.get('prompt', '').strip()
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    # Create video record
    video = Video(
        user_id=current_user_id,
        prompt=prompt,
        style=data.get('style', 'cinematic'),
        duration=min(data.get('duration', 6), 60),  # Max 60 seconds
        resolution=data.get('resolution', '1024x576'),
        voice_id=data.get('voice_id'),
        script=data.get('script'),
        status=VideoStatus.PENDING.value
    )
    
    db.session.add(video)
    db.session.commit()
    
    # Queue background task
    task = generate_video_task.delay(video.id)
    
    # Save task reference
    gen_task = GenerationTask(
        video_id=video.id,
        celery_task_id=task.id,
        task_type='video_generation',
        status='pending'
    )
    db.session.add(gen_task)
    db.session.commit()
    
    return jsonify({
        'video_id': video.id,
        'status': video.status,
        'message': 'Video generation started'
    }), 202


@video_bp.route('', methods=['GET'])
@jwt_required()
def list_videos():
    """List all videos for current user."""
    current_user_id = get_jwt_identity()
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status')
    
    query = Video.query.filter_by(user_id=current_user_id)
    
    if status:
        query = query.filter_by(status=status)
    
    query = query.order_by(Video.created_at.desc())
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'videos': [v.to_dict() for v in pagination.items],
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'pages': pagination.pages
    }), 200


@video_bp.route('/<int:video_id>', methods=['GET'])
@jwt_required()
def get_video(video_id):
    """Get video details and status."""
    current_user_id = get_jwt_identity()
    
    video = Video.query.filter_by(id=video_id, user_id=current_user_id).first()
    
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    
    # Get latest task status
    latest_task = video.generation_tasks.order_by(
        GenerationTask.created_at.desc()
    ).first()
    
    response = video.to_dict()
    if latest_task:
        response['task'] = latest_task.to_dict()
    
    return jsonify(response), 200


@video_bp.route('/<int:video_id>', methods=['DELETE'])
@jwt_required()
def delete_video(video_id):
    """Delete a video."""
    current_user_id = get_jwt_identity()
    
    video = Video.query.filter_by(id=video_id, user_id=current_user_id).first()
    
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    
    db.session.delete(video)
    db.session.commit()
    
    return jsonify({'message': 'Video deleted'}), 200


@video_bp.route('/<int:video_id>/retry', methods=['POST'])
@jwt_required()
def retry_video(video_id):
    """Retry failed video generation."""
    current_user_id = get_jwt_identity()
    
    video = Video.query.filter_by(id=video_id, user_id=current_user_id).first()
    
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    
    if video.status not in [VideoStatus.FAILED.value, VideoStatus.PENDING.value]:
        return jsonify({'error': 'Can only retry failed or pending videos'}), 400
    
    # Reset status
    video.status = VideoStatus.PENDING.value
    video.error_message = None
    db.session.commit()
    
    # Queue new task
    task = generate_video_task.delay(video.id)
    
    gen_task = GenerationTask(
        video_id=video.id,
        celery_task_id=task.id,
        task_type='video_generation',
        status='pending'
    )
    db.session.add(gen_task)
    db.session.commit()
    
    return jsonify({
        'video_id': video.id,
        'status': video.status,
        'message': 'Video generation restarted'
    }), 202


@video_bp.route('/<int:video_id>/script', methods=['POST'])
@jwt_required()
def generate_script(video_id):
    """Generate or regenerate script for video."""
    current_user_id = get_jwt_identity()
    
    video = Video.query.filter_by(id=video_id, user_id=current_user_id).first()
    
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    
    try:
        service = TextToVideoService()
        script = service.generate_script(video.prompt, video.style, video.duration)
        
        video.script = script
        db.session.commit()
        
        return jsonify({
            'script': script,
            'video_id': video.id
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@video_bp.route('/<int:video_id>/seo', methods=['POST'])
@jwt_required()
def generate_seo(video_id):
    """Generate SEO metadata for video."""
    current_user_id = get_jwt_identity()
    
    video = Video.query.filter_by(id=video_id, user_id=current_user_id).first()
    
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    
    try:
        service = TextToVideoService()
        seo = service.generate_seo(video.prompt, video.script)
        
        video.seo_title = seo.get('title')
        video.seo_description = seo.get('description')
        video.seo_tags = seo.get('tags', [])
        db.session.commit()
        
        return jsonify({
            'seo': seo,
            'video_id': video.id
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
