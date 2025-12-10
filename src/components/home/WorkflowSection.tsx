import { CheckCircle2, ArrowDown } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Enter Your Prompt",
    description: "Describe your video idea—topic, style, length. Example: 'How to cook spaghetti with garlic and olive oil'",
    details: ["Natural language input", "Topic suggestions", "Template library"]
  },
  {
    number: "02",
    title: "AI Generates Content",
    description: "Our AI analyzes your prompt, writes a script, selects visuals, and creates a professional voiceover.",
    details: ["Smart script writing", "Visual matching", "Voice synthesis"]
  },
  {
    number: "03",
    title: "Customize & Perfect",
    description: "Fine-tune the style, adjust timing, swap voices, and edit any element to match your vision.",
    details: ["100+ voice options", "Style presets", "Timeline editor"]
  },
  {
    number: "04",
    title: "SEO Optimization",
    description: "Get AI-suggested titles, descriptions, tags, and thumbnails designed to maximize reach.",
    details: ["Keyword analysis", "Thumbnail generation", "Platform optimization"]
  },
  {
    number: "05",
    title: "Publish & Track",
    description: "Post to YouTube, social media, and more. Monitor performance with AI-driven analytics.",
    details: ["One-click publishing", "Cross-platform", "Real-time analytics"]
  }
];

const WorkflowSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            From Idea to Video in
            <span className="gradient-text"> 5 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No video editing experience required. Our AI handles the complexity.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step, i) => (
            <div key={i}>
              <div 
                className="glass rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-primary/30 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center glow-primary">
                      <span className="font-display font-bold text-xl text-primary-foreground">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-xl md:text-2xl mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {step.details.map((detail, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              {i < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="w-6 h-6 text-muted-foreground/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
