import { useState } from "react";
import { Play, Pause, Check, Mic2, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Voice } from "@/types/video";

const voices: Voice[] = [
  { id: "aria", name: "Aria", gender: "female", accent: "American", style: "Professional" },
  { id: "roger", name: "Roger", gender: "male", accent: "British", style: "Warm" },
  { id: "sarah", name: "Sarah", gender: "female", accent: "American", style: "Friendly" },
  { id: "george", name: "George", gender: "male", accent: "British", style: "Authoritative" },
  { id: "lily", name: "Lily", gender: "female", accent: "Australian", style: "Energetic" },
  { id: "daniel", name: "Daniel", gender: "male", accent: "American", style: "Casual" },
  { id: "charlotte", name: "Charlotte", gender: "female", accent: "British", style: "Elegant" },
  { id: "liam", name: "Liam", gender: "male", accent: "Irish", style: "Storyteller" },
  { id: "alice", name: "Alice", gender: "female", accent: "German", style: "Clear" },
  { id: "brian", name: "Brian", gender: "male", accent: "American", style: "Deep" },
  { id: "jessica", name: "Jessica", gender: "female", accent: "Canadian", style: "Upbeat" },
  { id: "chris", name: "Chris", gender: "male", accent: "Australian", style: "Relaxed" },
];

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelect: (voiceId: string) => void;
}

const VoiceSelector = ({ selectedVoice, onSelect }: VoiceSelectorProps) => {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "male" | "female">("all");

  const filteredVoices = voices.filter(v => 
    filter === "all" || v.gender === filter
  );

  const togglePlay = (voiceId: string) => {
    setPlayingVoice(playingVoice === voiceId ? null : voiceId);
    // In real implementation, this would play the voice preview
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Mic2 className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg">Select Voice</h3>
            <p className="text-sm text-muted-foreground">Choose from 100+ AI voices</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["all", "male", "female"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Voice Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {filteredVoices.map((voice) => (
          <div
            key={voice.id}
            onClick={() => onSelect(voice.id)}
            className={cn(
              "glass rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-primary/30",
              selectedVoice === voice.id && "border-primary/50 bg-primary/5"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  voice.gender === "female" ? "bg-secondary/20" : "bg-primary/20"
                )}>
                  <User className={cn(
                    "w-5 h-5",
                    voice.gender === "female" ? "text-secondary" : "text-primary"
                  )} />
                </div>
                <div>
                  <h4 className="font-medium">{voice.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="w-3 h-3" />
                    {voice.accent}
                  </div>
                </div>
              </div>

              {selectedVoice === voice.id && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {voice.style}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay(voice.id);
                }}
              >
                {playingVoice === voice.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceSelector;
