"""
Text-to-Video Service

Main orchestrator for the video generation pipeline.
"""
import os
from typing import Dict, Any, Optional

from app.services.prompt_engine import PromptEngine
from app.services.ai_provider_service import AIProviderService
from app.utils.ffmpeg_utils import FFmpegProcessor


class TextToVideoService:
    """
    Main service orchestrating the text-to-video pipeline.
    
    Flow:
    1. Enhance prompt
    2. Generate script (optional)
    3. Generate audio (optional)
    4. Generate video
    5. Post-process with FFmpeg
    6. Generate SEO metadata
    """
    
    def __init__(self, provider: str = None):
        self.ai_service = AIProviderService(provider)
        self.ffmpeg = FFmpegProcessor()
        self.output_dir = os.getenv('VIDEO_OUTPUT_DIR', 'app/static/videos')
        
        # Ensure output directory exists
        os.makedirs(self.output_dir, exist_ok=True)
    
    def create_video(
        self,
        prompt: str,
        style: str = 'cinematic',
        duration: int = 6,
        resolution: str = '1024x576',
        voice_id: str = None,
        script: str = None
    ) -> Dict[str, Any]:
        """
        Full video creation pipeline.
        
        Args:
            prompt: User's text prompt
            style: Video style
            duration: Video duration in seconds
            resolution: Video resolution
            voice_id: ElevenLabs voice ID (optional)
            script: Custom script (optional)
            
        Returns:
            Dictionary with task info and status
        """
        # Step 1: Prepare prompt
        prepared = PromptEngine.prepare_prompt(prompt, style)
        
        # Step 2: Generate or use provided script
        if not script:
            script = self.generate_script(prompt, style, duration)
        
        # Step 3: Generate video
        video_result = self.ai_service.generate_video(
            prompt=prepared['enhanced'],
            duration=duration,
            resolution=resolution
        )
        
        return {
            'task_id': video_result.get('task_id'),
            'status': video_result.get('status'),
            'provider': video_result.get('provider'),
            'enhanced_prompt': prepared['enhanced'],
            'script': script,
            'error': video_result.get('error')
        }
    
    def check_status(self, task_id: str) -> Dict[str, Any]:
        """Check video generation status."""
        return self.ai_service.check_video_status(task_id)
    
    def generate_script(self, prompt: str, style: str, duration: int) -> str:
        """Generate video script."""
        return AIProviderService.generate_script(prompt, style, duration)
    
    def generate_seo(self, prompt: str, script: str = None) -> Dict[str, Any]:
        """Generate SEO metadata."""
        return AIProviderService.generate_seo(prompt, script)
    
    def generate_audio(self, text: str, voice_id: str) -> Optional[str]:
        """Generate voice audio."""
        return AIProviderService.generate_voice(text, voice_id)
    
    def post_process(
        self,
        video_path: str,
        audio_path: str = None,
        output_format: str = 'mp4'
    ) -> str:
        """
        Post-process video with FFmpeg.
        
        Args:
            video_path: Path to source video
            audio_path: Path to audio file (optional)
            output_format: Output format
            
        Returns:
            Path to processed video
        """
        output_path = os.path.join(
            self.output_dir,
            f"processed_{os.path.basename(video_path)}"
        )
        
        if audio_path:
            # Merge audio with video
            return self.ffmpeg.merge_audio(video_path, audio_path, output_path)
        else:
            # Just optimize/convert
            return self.ffmpeg.optimize_video(video_path, output_path)
    
    def generate_thumbnail(self, video_path: str) -> str:
        """Extract thumbnail from video."""
        return self.ffmpeg.extract_thumbnail(video_path)
