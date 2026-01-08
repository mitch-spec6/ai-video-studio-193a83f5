"""
Prompt Engine Service

Enhances and sanitizes user prompts before sending to AI providers.
"""


class PromptEngine:
    """Enhance and optimize prompts for video generation."""
    
    STYLE_MODIFIERS = {
        'cinematic': 'cinematic lighting, professional color grading, film-like quality, dramatic composition',
        'anime': 'anime style, vibrant colors, dynamic action, Japanese animation aesthetic',
        'realistic': 'photorealistic, 8K resolution, natural lighting, ultra detailed',
        'artistic': 'artistic interpretation, creative composition, expressive colors, painterly style',
        'minimal': 'minimalist design, clean composition, subtle movements, elegant simplicity',
        'retro': 'vintage aesthetic, nostalgic vibes, film grain, classic style',
        'futuristic': 'sci-fi aesthetic, neon lights, cyberpunk elements, advanced technology',
        'nature': 'natural beauty, organic movement, serene atmosphere, nature documentary style',
    }
    
    QUALITY_KEYWORDS = [
        'ultra high quality',
        'smooth motion',
        'professional production',
        'detailed textures',
        '4K resolution'
    ]
    
    NEGATIVE_KEYWORDS = [
        'blur', 'blurry', 'low quality', 'distorted', 'glitch',
        'watermark', 'text overlay', 'logo'
    ]
    
    @classmethod
    def enhance_prompt(cls, prompt: str, style: str = 'cinematic') -> str:
        """
        Enhance a user prompt with style modifiers and quality keywords.
        
        Args:
            prompt: Original user prompt
            style: Video style (cinematic, anime, realistic, etc.)
            
        Returns:
            Enhanced prompt string
        """
        # Get style modifiers
        style_mod = cls.STYLE_MODIFIERS.get(style, cls.STYLE_MODIFIERS['cinematic'])
        
        # Build enhanced prompt
        enhanced = f"{prompt.strip()}, {style_mod}"
        
        # Add quality keywords
        quality_str = ', '.join(cls.QUALITY_KEYWORDS)
        enhanced = f"{enhanced}, {quality_str}"
        
        return enhanced
    
    @classmethod
    def get_negative_prompt(cls) -> str:
        """Get negative prompt to exclude unwanted elements."""
        return ', '.join(cls.NEGATIVE_KEYWORDS)
    
    @classmethod
    def sanitize_prompt(cls, prompt: str) -> str:
        """
        Clean and sanitize user input.
        
        Args:
            prompt: Raw user input
            
        Returns:
            Sanitized prompt
        """
        # Remove excessive whitespace
        prompt = ' '.join(prompt.split())
        
        # Remove potentially problematic characters
        prompt = prompt.replace('\n', ' ').replace('\r', ' ')
        
        # Truncate if too long
        max_length = 500
        if len(prompt) > max_length:
            prompt = prompt[:max_length].rsplit(' ', 1)[0] + '...'
        
        return prompt
    
    @classmethod
    def prepare_prompt(cls, prompt: str, style: str = 'cinematic') -> dict:
        """
        Full prompt preparation pipeline.
        
        Args:
            prompt: Raw user prompt
            style: Video style
            
        Returns:
            Dictionary with prepared prompts
        """
        sanitized = cls.sanitize_prompt(prompt)
        enhanced = cls.enhance_prompt(sanitized, style)
        negative = cls.get_negative_prompt()
        
        return {
            'original': prompt,
            'sanitized': sanitized,
            'enhanced': enhanced,
            'negative': negative,
            'style': style
        }
