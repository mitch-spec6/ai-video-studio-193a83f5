export interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  preview_url?: string;
  style: string;
}

export interface VideoStyle {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

export interface VideoProject {
  id: string;
  prompt: string;
  script: string;
  voice_id: string;
  style_id: string;
  duration: number;
  status: 'draft' | 'generating' | 'ready' | 'published';
  video_url?: string;
  thumbnail_url?: string;
  seo: SEOData;
  created_at: string;
  updated_at: string;
}

export interface SEOData {
  title: string;
  description: string;
  tags: string[];
  thumbnail_suggestions: string[];
}

export interface GenerationStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}
