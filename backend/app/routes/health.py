"""
Health Check Routes
"""
from flask import Blueprint, jsonify
from app.extensions import db

health_bp = Blueprint('health', __name__)


@health_bp.route('/health', methods=['GET'])
def health_check():
    """Basic health check."""
    return jsonify({
        'status': 'healthy',
        'service': 'text-to-video-api'
    }), 200


@health_bp.route('/health/db', methods=['GET'])
def db_health_check():
    """Database health check."""
    try:
        db.session.execute(db.text('SELECT 1'))
        return jsonify({
            'status': 'healthy',
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }), 503
