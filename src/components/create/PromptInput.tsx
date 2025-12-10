import { useState } from "react";
import { Wand2, Sparkles, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

const suggestions = [
  "How to make the perfect French omelette in 5 minutes",
  "Top 10 productivity tips for remote workers",
  "The science behind black holes explained simply",
  "Quick morning yoga routine for beginners",
  "History of ancient Egypt in 3 minutes"
];

const PromptInput = ({ onSubmit, isLoading }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Input */}
      <div 
        className={cn(
          "relative rounded-2xl transition-all duration-300",
          isFocused && "glow-primary"
        )}
      >
        <div className={cn(
          "glass-strong rounded-2xl p-6 transition-all duration-300",
          isFocused && "border-primary/50"
        )}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Wand2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Describe your video idea... e.g., 'Create a tutorial on how to cook spaghetti with garlic and olive oil, keep it under 2 minutes'"
                className="w-full bg-transparent text-foreground text-lg placeholder:text-muted-foreground focus:outline-none resize-none min-h-[120px]"
                rows={4}
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4" />
                  <span>AI will generate script, visuals & voiceover</span>
                </div>
                <Button
                  variant="gradient"
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Video
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lightbulb className="w-4 h-4" />
          <span>Need inspiration? Try one of these:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setPrompt(suggestion)}
              className="px-4 py-2 rounded-full glass text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
