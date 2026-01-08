"""
Input Validators
"""
import re
from typing import Tuple


def validate_email(email: str) -> bool:
    """
    Validate email format.
    
    Args:
        email: Email address to validate
        
    Returns:
        True if valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_password(password: str) -> Tuple[bool, str]:
    """
    Validate password strength.
    
    Requirements:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    
    Args:
        password: Password to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one digit"
    
    return True, ""


def validate_prompt(prompt: str) -> Tuple[bool, str]:
    """
    Validate video prompt.
    
    Args:
        prompt: User's video prompt
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not prompt or not prompt.strip():
        return False, "Prompt cannot be empty"
    
    if len(prompt) < 10:
        return False, "Prompt must be at least 10 characters"
    
    if len(prompt) > 1000:
        return False, "Prompt must be less than 1000 characters"
    
    return True, ""


def validate_resolution(resolution: str) -> bool:
    """
    Validate video resolution format.
    
    Args:
        resolution: Resolution string (e.g., "1024x576")
        
    Returns:
        True if valid, False otherwise
    """
    pattern = r'^\d{3,4}x\d{3,4}$'
    if not re.match(pattern, resolution):
        return False
    
    width, height = map(int, resolution.split('x'))
    
    # Check reasonable bounds
    if width < 256 or width > 1920:
        return False
    if height < 256 or height > 1080:
        return False
    
    return True
