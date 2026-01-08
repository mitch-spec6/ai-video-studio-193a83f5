"""
Celery Worker Entry Point

Run with: celery -A celery_worker.celery worker --loglevel=info
"""
from app import create_app
from app.tasks.video_tasks import celery_app

# Create Flask app for context
flask_app = create_app()

# Alias for celery CLI
celery = celery_app

if __name__ == '__main__':
    celery_app.start()
