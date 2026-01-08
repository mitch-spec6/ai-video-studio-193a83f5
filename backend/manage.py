#!/usr/bin/env python
"""
Flask Application Manager

Usage:
    python manage.py run         # Run development server
    python manage.py init-db     # Initialize database
    python manage.py migrate     # Run migrations
    python manage.py shell       # Open interactive shell
"""
import os
import sys
import click
from flask.cli import FlaskGroup

from app import create_app
from app.extensions import db
from app.models import User, Video, GenerationTask


def create_cli_app():
    return create_app()


@click.group(cls=FlaskGroup, create_app=create_cli_app)
def cli():
    """Flask application management commands."""
    pass


@cli.command()
def run():
    """Run the development server."""
    app = create_app()
    app.run(
        host=os.getenv('FLASK_HOST', '0.0.0.0'),
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    )


@cli.command('init-db')
def init_db():
    """Initialize the database."""
    app = create_app()
    with app.app_context():
        db.create_all()
        click.echo('Database initialized.')


@cli.command('drop-db')
@click.confirmation_option(prompt='Are you sure you want to drop all tables?')
def drop_db():
    """Drop all database tables."""
    app = create_app()
    with app.app_context():
        db.drop_all()
        click.echo('Database tables dropped.')


@cli.command('create-user')
@click.option('--email', prompt=True, help='User email address')
@click.option('--password', prompt=True, hide_input=True, confirmation_prompt=True)
@click.option('--name', prompt='Full name', help='User full name')
def create_user(email, password, name):
    """Create a new user."""
    app = create_app()
    with app.app_context():
        if User.query.filter_by(email=email).first():
            click.echo(f'Error: User {email} already exists.')
            return
        
        user = User(email=email, full_name=name)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        click.echo(f'User {email} created successfully.')


@cli.command()
def shell():
    """Open interactive shell with app context."""
    import code
    app = create_app()
    with app.app_context():
        ctx = {
            'app': app,
            'db': db,
            'User': User,
            'Video': Video,
            'GenerationTask': GenerationTask
        }
        code.interact(local=ctx)


if __name__ == '__main__':
    cli()
