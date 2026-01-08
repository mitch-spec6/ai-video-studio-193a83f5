"""
Text-to-Video Flask Application Factory
"""
from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import db, migrate, jwt, ma


def create_app(config_class=Config):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    
    # Enable CORS for frontend
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', '*'),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.video import video_bp
    from app.routes.health import health_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(video_bp, url_prefix='/api/videos')
    app.register_blueprint(health_bp, url_prefix='/api')

    return app
