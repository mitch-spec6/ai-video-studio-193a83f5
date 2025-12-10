import { 
  FileText, 
  Mic2, 
  Palette, 
  Search, 
  Share2, 
  BarChart3,
  Zap,
  Globe
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Script Generation",
    description: "Enter your topic and watch AI craft a compelling, engaging script tailored to your audience.",
    gradient: "from-primary/20 to-primary/5"
  },
  {
    icon: Mic2,
    title: "100+ AI Voices",
    description: "Choose from realistic voices in multiple languages, accents, and styles for perfect narration.",
    gradient: "from-secondary/20 to-secondary/5"
  },
  {
    icon: Palette,
    title: "Visual Customization",
    description: "Select styles, animations, and footage. The AI matches visuals to your script automatically.",
    gradient: "from-accent/20 to-accent/5"
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Get AI-generated titles, descriptions, tags, and thumbnails optimized for discoverability.",
    gradient: "from-primary/20 to-accent/5"
  },
  {
    icon: Share2,
    title: "One-Click Publishing",
    description: "Post directly to YouTube, TikTok, Instagram, and more with a single click.",
    gradient: "from-secondary/20 to-primary/5"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track performance across platforms with AI insights and optimization recommendations.",
    gradient: "from-accent/20 to-secondary/5"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Powerful Features
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            Everything You Need to
            <span className="gradient-text"> Create & Grow</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From idea to viral video in minutes. Our AI handles the heavy lifting so you can focus on creativity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group glass rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110`}>
                <feature.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-3">
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Trusted by creators in <span className="text-foreground font-medium">150+ countries</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
