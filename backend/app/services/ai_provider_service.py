"""
AI Provider Service

Handles integration with various AI providers for video, audio, and text generation.
"""
import os
import time
import requests
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

import openai
import replicate


class BaseVideoProvider(ABC):
    """Base class for video generation providers."""
    
    @abstractmethod
    def generate(self, prompt: str, duration: int, resolution: str) -> Dict[str, Any]:
        """Generate video from prompt."""
        pass
    
    @abstractmethod
    def check_status(self, task_id: str) -> Dict[str, Any]:
        """Check generation status."""
        pass


class ReplicateProvider(BaseVideoProvider):
    """Replicate.com provider for Stable Video Diffusion."""
    
    MODEL_ID = "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438"
    
    def __init__(self):
        self.client = replicate.Client(api_token=os.getenv('REPLICATE_API_TOKEN'))
    
    def generate(self, prompt: str, duration: int, resolution: str) -> Dict[str, Any]:
        """Generate video using Stable Video Diffusion on Replicate."""
        try:
            # Parse resolution
            width, height = map(int, resolution.split('x'))
            
            # Calculate frames (SVD typically uses 25 fps)
            num_frames = min(duration * 25, 100)  # Max 100 frames
            
            prediction = self.client.predictions.create(
                model=self.MODEL_ID,
                input={
                    "prompt": prompt,
                    "width": width,
                    "height": height,
                    "num_frames": num_frames,
                    "fps": 25,
                }
            )
            
            return {
                'task_id': prediction.id,
                'status': prediction.status,
                'provider': 'replicate'
            }
        except Exception as e:
            return {
                'error': str(e),
                'status': 'failed',
                'provider': 'replicate'
            }
    
    def check_status(self, task_id: str) -> Dict[str, Any]:
        """Check Replicate prediction status."""
        try:
            prediction = self.client.predictions.get(task_id)
            
            result = {
                'task_id': task_id,
                'status': prediction.status,
                'provider': 'replicate'
            }
            
            if prediction.status == 'succeeded':
                result['video_url'] = prediction.output
            elif prediction.status == 'failed':
                result['error'] = prediction.error
            
            return result
        except Exception as e:
            return {
                'task_id': task_id,
                'status': 'failed',
                'error': str(e),
                'provider': 'replicate'
            }


class MockProvider(BaseVideoProvider):
    """Mock provider for testing."""
    
    def generate(self, prompt: str, duration: int, resolution: str) -> Dict[str, Any]:
        """Simulate video generation."""
        task_id = f"mock_{int(time.time())}"
        return {
            'task_id': task_id,
            'status': 'processing',
            'provider': 'mock'
        }
    
    def check_status(self, task_id: str) -> Dict[str, Any]:
        """Simulate status check - always returns completed."""
        return {
            'task_id': task_id,
            'status': 'succeeded',
            'video_url': 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            'provider': 'mock'
        }


class AIProviderService:
    """Main service for AI-powered generation."""
    
    PROVIDERS = {
        'replicate': ReplicateProvider,
        'mock': MockProvider,
    }
    
    def __init__(self, provider: str = None):
        provider = provider or os.getenv('AI_VIDEO_PROVIDER', 'replicate')
        
        if provider not in self.PROVIDERS:
            raise ValueError(f"Unknown provider: {provider}")
        
        self.video_provider = self.PROVIDERS[provider]()
        self.provider_name = provider
    
    def generate_video(self, prompt: str, duration: int = 6, resolution: str = '1024x576') -> Dict[str, Any]:
        """Generate video from text prompt."""
        return self.video_provider.generate(prompt, duration, resolution)
    
    def check_video_status(self, task_id: str) -> Dict[str, Any]:
        """Check video generation status."""
        return self.video_provider.check_status(task_id)
    
    @staticmethod
    def generate_script(prompt: str, style: str, duration: int) -> str:
        """Generate video script using OpenAI."""
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            return f"[Auto-generated script for: {prompt}]"
        
        client = openai.OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": f"You are a video script writer. Write a {duration}-second video script in a {style} style. Be concise and visual."
                },
                {
                    "role": "user",
                    "content": f"Write a video script for: {prompt}"
                }
            ],
            max_tokens=500
        )
        
        return response.choices[0].message.content
    
    @staticmethod
    def generate_seo(prompt: str, script: str = None) -> Dict[str, Any]:
        """Generate SEO metadata using OpenAI."""
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            return {
                'title': prompt[:60],
                'description': prompt[:160],
                'tags': prompt.split()[:10]
            }
        
        client = openai.OpenAI(api_key=api_key)
        
        content = f"Video topic: {prompt}"
        if script:
            content += f"\n\nScript: {script}"
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": """Generate SEO metadata for a video. Return JSON with:
                    - title: Engaging title under 60 characters
                    - description: Description under 160 characters
                    - tags: Array of 5-10 relevant tags"""
                },
                {
                    "role": "user",
                    "content": content
                }
            ],
            response_format={"type": "json_object"}
        )
        
        import json
        return json.loads(response.choices[0].message.content)
    
    @staticmethod
    def generate_voice(text: str, voice_id: str = 'default') -> Optional[str]:
        """Generate voice audio using ElevenLabs."""
        api_key = os.getenv('ELEVENLABS_API_KEY')
        if not api_key:
            return None
        
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        
        headers = {
            "xi-api-key": api_key,
            "Content-Type": "application/json"
        }
        
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }
        
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            # Save audio file and return path
            audio_path = f"/tmp/audio_{int(time.time())}.mp3"
            with open(audio_path, 'wb') as f:
                f.write(response.content)
            return audio_path
        
        return None
