"""
FFmpeg Utility Functions

Post-processing utilities for video manipulation.
"""
import os
import subprocess
from typing import Optional


class FFmpegProcessor:
    """FFmpeg-based video processing utilities."""
    
    def __init__(self):
        self.ffmpeg_path = os.getenv('FFMPEG_PATH', 'ffmpeg')
        self.ffprobe_path = os.getenv('FFPROBE_PATH', 'ffprobe')
    
    def _run_command(self, cmd: list) -> tuple:
        """Run FFmpeg command and return output."""
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return -1, '', 'Command timed out'
        except Exception as e:
            return -1, '', str(e)
    
    def merge_audio(
        self,
        video_path: str,
        audio_path: str,
        output_path: str,
        audio_volume: float = 1.0
    ) -> str:
        """
        Merge audio track with video.
        
        Args:
            video_path: Path to video file
            audio_path: Path to audio file
            output_path: Path for output file
            audio_volume: Audio volume multiplier
            
        Returns:
            Path to merged video
        """
        cmd = [
            self.ffmpeg_path,
            '-y',  # Overwrite output
            '-i', video_path,
            '-i', audio_path,
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-filter:a', f'volume={audio_volume}',
            '-shortest',  # Match shortest stream
            '-map', '0:v:0',
            '-map', '1:a:0',
            output_path
        ]
        
        returncode, _, stderr = self._run_command(cmd)
        
        if returncode != 0:
            raise Exception(f"FFmpeg error: {stderr}")
        
        return output_path
    
    def optimize_video(
        self,
        input_path: str,
        output_path: str,
        crf: int = 23,
        preset: str = 'medium'
    ) -> str:
        """
        Optimize video for web delivery.
        
        Args:
            input_path: Path to input video
            output_path: Path for output file
            crf: Constant Rate Factor (0-51, lower = better quality)
            preset: Encoding speed preset
            
        Returns:
            Path to optimized video
        """
        cmd = [
            self.ffmpeg_path,
            '-y',
            '-i', input_path,
            '-c:v', 'libx264',
            '-crf', str(crf),
            '-preset', preset,
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',  # Enable streaming
            output_path
        ]
        
        returncode, _, stderr = self._run_command(cmd)
        
        if returncode != 0:
            raise Exception(f"FFmpeg error: {stderr}")
        
        return output_path
    
    def extract_thumbnail(
        self,
        video_path: str,
        output_path: Optional[str] = None,
        timestamp: str = '00:00:01'
    ) -> str:
        """
        Extract thumbnail frame from video.
        
        Args:
            video_path: Path to video file
            output_path: Path for thumbnail (auto-generated if None)
            timestamp: Time position for thumbnail
            
        Returns:
            Path to thumbnail image
        """
        if not output_path:
            base = os.path.splitext(video_path)[0]
            output_path = f"{base}_thumb.jpg"
        
        cmd = [
            self.ffmpeg_path,
            '-y',
            '-i', video_path,
            '-ss', timestamp,
            '-vframes', '1',
            '-q:v', '2',
            output_path
        ]
        
        returncode, _, stderr = self._run_command(cmd)
        
        if returncode != 0:
            raise Exception(f"FFmpeg error: {stderr}")
        
        return output_path
    
    def get_video_info(self, video_path: str) -> dict:
        """
        Get video metadata using FFprobe.
        
        Args:
            video_path: Path to video file
            
        Returns:
            Dictionary with video info
        """
        cmd = [
            self.ffprobe_path,
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_format',
            '-show_streams',
            video_path
        ]
        
        returncode, stdout, stderr = self._run_command(cmd)
        
        if returncode != 0:
            raise Exception(f"FFprobe error: {stderr}")
        
        import json
        return json.loads(stdout)
    
    def trim_video(
        self,
        input_path: str,
        output_path: str,
        start_time: str,
        duration: str
    ) -> str:
        """
        Trim video to specified duration.
        
        Args:
            input_path: Path to input video
            output_path: Path for trimmed video
            start_time: Start timestamp (HH:MM:SS)
            duration: Duration (HH:MM:SS or seconds)
            
        Returns:
            Path to trimmed video
        """
        cmd = [
            self.ffmpeg_path,
            '-y',
            '-i', input_path,
            '-ss', start_time,
            '-t', duration,
            '-c', 'copy',
            output_path
        ]
        
        returncode, _, stderr = self._run_command(cmd)
        
        if returncode != 0:
            raise Exception(f"FFmpeg error: {stderr}")
        
        return output_path
    
    def resize_video(
        self,
        input_path: str,
        output_path: str,
        width: int,
        height: int
    ) -> str:
        """
        Resize video to specified dimensions.
        
        Args:
            input_path: Path to input video
            output_path: Path for resized video
            width: Target width
            height: Target height
            
        Returns:
            Path to resized video
        """
        cmd = [
            self.ffmpeg_path,
            '-y',
            '-i', input_path,
            '-vf', f'scale={width}:{height}',
            '-c:a', 'copy',
            output_path
        ]
        
        returncode, _, stderr = self._run_command(cmd)
        
        if returncode != 0:
            raise Exception(f"FFmpeg error: {stderr}")
        
        return output_path
