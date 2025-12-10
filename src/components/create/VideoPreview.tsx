import { Play, Pause, Volume2, VolumeX, Maximize2, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  title: string;
}

const VideoPreview = ({ videoUrl, thumbnailUrl, title }: VideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="relative aspect-video rounded-2xl overflow-hidden glass-strong">
        {/* Video/Thumbnail */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20"
          style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})`, backgroundSize: 'cover' } : {}}
        >
          {/* Placeholder for actual video */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!isPlaying && (
              <button
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center transition-transform hover:scale-110 glow-primary"
              >
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Controls Overlay */}
        <div className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent p-4 transition-opacity",
          isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
        )}>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-1 bg-muted/50 rounded-full overflow-hidden cursor-pointer group">
              <div 
                className="h-full bg-primary transition-all group-hover:h-1.5"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                0:00 / 2:30
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg truncate">
          {title}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="gradient" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
