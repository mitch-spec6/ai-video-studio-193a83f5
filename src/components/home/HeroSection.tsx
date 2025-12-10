import { ArrowRight, Play, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(185_85%_55%/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(320_85%_60%/0.08),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(220_15%_15%/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(220_15%_15%/0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-Powered Video Generation
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-6 animate-slide-up">
            Create Stunning Videos
            <br />
            <span className="gradient-text">With Just Words</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Transform your ideas into professional videos instantly. 
            AI generates scripts, visuals, and voiceovers—all from a simple prompt.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              variant="hero" 
              size="xl"
              onClick={onGetStarted}
              className="group"
            >
              <Wand2 className="w-5 h-5" />
              Start Creating Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="glass" size="xl" className="gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {[
              { value: "50K+", label: "Videos Created" },
              { value: "100+", label: "AI Voices" },
              { value: "4K", label: "Resolution" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-bold text-2xl md:text-3xl gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Preview Cards */}
        <div className="absolute top-1/4 left-8 hidden lg:block animate-float">
          <div className="glass rounded-xl p-4 w-48">
            <div className="w-full h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3" />
            <div className="h-2 bg-muted rounded w-3/4 mb-2" />
            <div className="h-2 bg-muted rounded w-1/2" />
          </div>
        </div>

        <div className="absolute bottom-1/4 right-8 hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
          <div className="glass rounded-xl p-4 w-48">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-primary" />
              <div className="flex-1">
                <div className="h-2 bg-muted rounded w-full mb-1" />
                <div className="h-2 bg-muted rounded w-2/3" />
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-1 h-8 bg-primary/20 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
