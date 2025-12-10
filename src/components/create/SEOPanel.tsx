import { useState } from "react";
import { Search, Tag, FileText, Image, RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SEOData } from "@/types/video";

interface SEOPanelProps {
  seoData: SEOData;
  onUpdate: (data: SEOData) => void;
  onRegenerate: () => void;
}

const SEOPanel = ({ seoData, onUpdate, onRegenerate }: SEOPanelProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTagRemove = (tag: string) => {
    onUpdate({
      ...seoData,
      tags: seoData.tags.filter(t => t !== tag)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg">SEO Optimization</h3>
            <p className="text-sm text-muted-foreground">AI-generated metadata for maximum reach</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onRegenerate}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Regenerate All
        </Button>
      </div>

      {/* Title */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-medium">Title</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy('title', seoData.title)}
          >
            {copiedField === 'title' ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <input
          type="text"
          value={seoData.title}
          onChange={(e) => onUpdate({ ...seoData, title: e.target.value })}
          className="w-full bg-muted/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{seoData.title.length} characters</span>
          <span className={seoData.title.length > 60 ? 'text-destructive' : ''}>
            Recommended: 50-60 characters
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-secondary" />
            <span className="font-medium">Description</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy('description', seoData.description)}
          >
            {copiedField === 'description' ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <textarea
          value={seoData.description}
          onChange={(e) => onUpdate({ ...seoData, description: e.target.value })}
          rows={4}
          className="w-full bg-muted/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{seoData.description.length} characters</span>
          <span className={seoData.description.length > 160 ? 'text-destructive' : ''}>
            Recommended: 150-160 characters
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-accent" />
          <span className="font-medium">Tags</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {seoData.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-sm group cursor-pointer hover:bg-destructive/20 transition-colors"
              onClick={() => handleTagRemove(tag)}
            >
              #{tag}
              <span className="opacity-0 group-hover:opacity-100 text-destructive">×</span>
            </span>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          Click a tag to remove it. {seoData.tags.length} tags selected.
        </div>
      </div>

      {/* Thumbnail Suggestions */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 text-primary" />
          <span className="font-medium">Thumbnail Ideas</span>
        </div>
        <div className="space-y-2">
          {seoData.thumbnail_suggestions.map((suggestion, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {i + 1}
              </div>
              <span className="text-sm text-foreground/90">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SEOPanel;
