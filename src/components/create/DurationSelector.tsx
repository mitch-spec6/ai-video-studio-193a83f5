import { Clock, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const presets = [
  { label: "Short", duration: 30, description: "Perfect for TikTok, Reels" },
  { label: "Medium", duration: 60, description: "Ideal for YouTube Shorts" },
  { label: "Standard", duration: 180, description: "Great for tutorials" },
  { label: "Long", duration: 300, description: "In-depth content" },
];

interface DurationSelectorProps {
  duration: number;
  onChange: (duration: number) => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
};

const DurationSelector = ({ duration, onChange }: DurationSelectorProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">Video Duration</h3>
          <p className="text-sm text-muted-foreground">Set the target length of your video</p>
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChange(preset.duration)}
            className={cn(
              "glass rounded-xl p-4 text-left transition-all duration-300 hover:border-primary/30",
              duration === preset.duration && "border-primary/50 bg-primary/5"
            )}
          >
            <div className="font-display font-semibold text-2xl gradient-text mb-1">
              {formatDuration(preset.duration)}
            </div>
            <div className="font-medium text-sm mb-1">{preset.label}</div>
            <div className="text-xs text-muted-foreground">{preset.description}</div>
          </button>
        ))}
      </div>

      {/* Custom Slider */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Custom duration</span>
          <span className="font-display font-semibold text-xl gradient-text">
            {formatDuration(duration)}
          </span>
        </div>
        
        <Slider
          value={[duration]}
          onValueChange={([value]) => onChange(value)}
          min={15}
          max={600}
          step={15}
          className="w-full"
        />

        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>15s</span>
          <span>10 min</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          AI will automatically adjust script length and pacing to match your target duration. 
          Longer videos allow for more detailed explanations.
        </p>
      </div>
    </div>
  );
};

export default DurationSelector;
