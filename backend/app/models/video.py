"""
Video Model
"""
from datetime import datetime
from enum import Enum

from app.extensions import db


class VideoStatus(str, Enum):
    """Video generation status."""
    PENDING = 'pending'
    PROCESSING = 'processing'
    COMPLETED = 'completed'
    FAILED = 'failed'


class Video(db.Model):
    """Video project model."""
    
    __tablename__ = 'videos'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Prompt and content
    prompt = db.Column(db.Text, nullable=False)
    enhanced_prompt = db.Column(db.Text)
    script = db.Column(db.Text)
    
    # Settings
    style = db.Column(db.String(50), default='cinematic')
    duration = db.Column(db.Integer, default=6)  # seconds
    resolution = db.Column(db.String(20), default='1024x576')
    voice_id = db.Column(db.String(100))
    
    # SEO
    seo_title = db.Column(db.String(255))
    seo_description = db.Column(db.Text)
    seo_tags = db.Column(db.ARRAY(db.String), default=[])
    
    # Generated content
    status = db.Column(db.String(20), default=VideoStatus.PENDING.value, index=True)
    video_url = db.Column(db.String(500))
    thumbnail_url = db.Column(db.String(500))
    audio_url = db.Column(db.String(500))
    error_message = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    generation_tasks = db.relationship('GenerationTask', backref='video', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self) -> dict:
        """Serialize video to dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'prompt': self.prompt,
            'enhanced_prompt': self.enhanced_prompt,
            'script': self.script,
            'style': self.style,
            'duration': self.duration,
            'resolution': self.resolution,
            'voice_id': self.voice_id,
            'seo_title': self.seo_title,
            'seo_description': self.seo_description,
            'seo_tags': self.seo_tags or [],
            'status': self.status,
            'video_url': self.video_url,
            'thumbnail_url': self.thumbnail_url,
            'audio_url': self.audio_url,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
    
    def __repr__(self):
        return f'<Video {self.id} - {self.status}>'
