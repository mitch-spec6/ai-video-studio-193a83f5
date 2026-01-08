"""
Generation Task Model
"""
from datetime import datetime
from enum import Enum

from app.extensions import db


class TaskType(str, Enum):
    """Task types."""
    VIDEO_GENERATION = 'video_generation'
    AUDIO_GENERATION = 'audio_generation'
    SCRIPT_GENERATION = 'script_generation'
    THUMBNAIL_GENERATION = 'thumbnail_generation'


class GenerationTask(db.Model):
    """Background task tracking model."""
    
    __tablename__ = 'generation_tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(db.Integer, db.ForeignKey('videos.id'), nullable=False, index=True)
    
    # Celery task info
    celery_task_id = db.Column(db.String(255), unique=True, index=True)
    task_type = db.Column(db.String(50), default=TaskType.VIDEO_GENERATION.value)
    
    # Status
    status = db.Column(db.String(20), default='pending')
    progress = db.Column(db.Integer, default=0)  # 0-100
    error_message = db.Column(db.Text)
    
    # External provider info
    provider = db.Column(db.String(50))
    provider_task_id = db.Column(db.String(255))
    
    # Timestamps
    started_at = db.Column(db.DateTime)
    finished_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self) -> dict:
        """Serialize task to dictionary."""
        return {
            'id': self.id,
            'video_id': self.video_id,
            'celery_task_id': self.celery_task_id,
            'task_type': self.task_type,
            'status': self.status,
            'progress': self.progress,
            'error_message': self.error_message,
            'provider': self.provider,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'finished_at': self.finished_at.isoformat() if self.finished_at else None,
        }
    
    def __repr__(self):
        return f'<GenerationTask {self.id} - {self.task_type}>'
