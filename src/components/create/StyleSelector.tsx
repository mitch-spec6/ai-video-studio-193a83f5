import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const styles = [
  {
    id: "modern",
    name: "Modern Minimal",
    description: "Clean, professional look with smooth animations",
    colors: ["#00d4ff", "#0a0a0f", "#ffffff"]
  },
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Movie-like visuals with dramatic transitions",
    colors: ["#ff6b35", "#1a1a2e", "#f5f5f5"]
  },
  {
    id: "playful",
    name: "Playful Pop",
    description: "Vibrant colors and bouncy animations",
    colors: ["#ff0080", "#7928ca", "#ffd700"]
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional and trustworthy aesthetic",
    colors: ["#0066cc", "#003366", "#ffffff"]
  },
  {
    id: "nature",
    name: "Organic Nature",
    description: "Earthy tones with flowing transitions",
    colors: ["#2d5016", "#8b7355", "#f4ede4"]
  },
  {
    id: "tech",
    name: "Tech Futuristic",
    description: "Neon accents with digital effects",
    colors: ["#00ff88", "#0a0a1a", "#ff00ff"]
  }
];

interface StyleSelectorProps {
  selectedStyle: string;
  onSelect: (styleId: string) => void;
}

const StyleSelector = ({ selectedStyle, onSelect }: StyleSelectorProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <Palette className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">Visual Style</h3>
          <p className="text-sm text-muted-foreground">Choose the look and feel of your video</p>
        </div>
      </div>

      {/* Style Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {styles.map((style) => (
          <div
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={cn(
              "glass rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/30 hover:scale-[1.02]",
              selectedStyle === style.id && "border-primary/50 ring-2 ring-primary/20"
            )}
          >
            {/* Color Preview */}
            <div className="h-24 relative overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${style.colors[0]} 0%, ${style.colors[1]} 50%, ${style.colors[2]} 100%)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              
              {selectedStyle === style.id && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h4 className="font-medium mb-1">{style.name}</h4>
              <p className="text-sm text-muted-foreground">{style.description}</p>
              
              {/* Color Dots */}
              <div className="flex gap-2 mt-3">
                {style.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
