# Text-to-Video Backend

Flask + Celery backend for AI-powered text-to-video generation.

## Architecture

```
backend/
├── app/
│   ├── __init__.py         # Flask app factory
│   ├── config.py           # Configuration
│   ├── extensions.py       # Flask extensions
│   │
│   ├── models/             # SQLAlchemy models
│   │   ├── user.py
│   │   ├── video.py
│   │   └── generation_task.py
│   │
│   ├── routes/             # API endpoints
│   │   ├── auth.py         # Authentication
│   │   ├── video.py        # Video CRUD
│   │   └── health.py       # Health checks
│   │
│   ├── services/           # Business logic
│   │   ├── prompt_engine.py
│   │   ├── ai_provider_service.py
│   │   └── text_to_video_service.py
│   │
│   ├── tasks/              # Celery tasks
│   │   └── video_tasks.py
│   │
│   └── utils/              # Utilities
│       ├── validators.py
│       └── ffmpeg_utils.py
│
├── celery_worker.py        # Celery entry point
├── manage.py               # Flask CLI
├── requirements.txt
├── Procfile                # Heroku/Railway config
└── .env.example
```

## Quick Start

### 1. Prerequisites

- Python 3.11+
- PostgreSQL
- Redis
- FFmpeg (for video processing)

### 2. Setup

```bash
# Clone and navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your API keys

# Initialize database
python manage.py init-db
```

### 3. Run

```bash
# Terminal 1: Flask API
python manage.py run

# Terminal 2: Celery Worker
celery -A celery_worker.celery worker --loglevel=info
```

### 4. Database Migrations

```bash
# Initialize migrations
flask db init

# Create migration
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update profile |

### Videos

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/videos` | Create video generation |
| GET | `/api/videos` | List user's videos |
| GET | `/api/videos/:id` | Get video status |
| DELETE | `/api/videos/:id` | Delete video |
| POST | `/api/videos/:id/retry` | Retry failed generation |
| POST | `/api/videos/:id/script` | Generate script |
| POST | `/api/videos/:id/seo` | Generate SEO metadata |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |
| GET | `/api/health/db` | Database health check |

## Video Generation Flow

```
POST /api/videos
     │
     ▼
┌────────────────┐
│ Validate Input │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Create Video   │
│ Record (DB)    │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Queue Celery   │
│ Task           │
└───────┬────────┘
        │
        ▼
┌────────────────────────────────────┐
│         Background Worker          │
│                                    │
│  1. Enhance Prompt                 │
│  2. Generate Script (OpenAI)       │
│  3. Generate Video (Replicate)     │
│  4. Poll for Completion            │
│  5. Post-process (FFmpeg)          │
│  6. Generate SEO (OpenAI)          │
│  7. Update Database                │
│                                    │
└───────┬────────────────────────────┘
        │
        ▼
GET /api/videos/:id → { status: "completed", video_url: "..." }
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `SECRET_KEY` | Flask secret key | Yes |
| `JWT_SECRET_KEY` | JWT signing key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `ELEVENLABS_API_KEY` | ElevenLabs API key | Optional |
| `REPLICATE_API_TOKEN` | Replicate API token | Yes |
| `AI_VIDEO_PROVIDER` | Video provider (replicate/mock) | No |
| `CORS_ORIGINS` | Allowed origins | No |

### AI Providers

**Video Generation:**
- Replicate (Stable Video Diffusion) - Default
- Mock (for testing)

**Script Generation:**
- OpenAI GPT-4

**Voice Generation:**
- ElevenLabs

## Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Render

1. Connect GitHub repo
2. Create PostgreSQL database
3. Create Redis instance
4. Create Web Service (API)
5. Create Background Worker (Celery)

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "app:create_app()", "--bind", "0.0.0.0:5000"]
```

## Frontend Integration

Update your frontend API client with the deployed URL:

```typescript
// src/lib/api.ts
const API_BASE_URL = 'https://your-backend.railway.app/api';
```

## License

MIT
