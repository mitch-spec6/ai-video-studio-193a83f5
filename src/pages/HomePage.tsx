import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import WorkflowSection from "@/components/home/WorkflowSection";

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage = ({ onGetStarted }: HomePageProps) => {
  return (
    <main className="min-h-screen">
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesSection />
      <WorkflowSection />
      
      {/* Footer CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            Ready to Create Your First Video?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of creators who are making professional videos with AI.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground font-bold text-lg px-10 py-5 rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 transition-transform glow-primary"
          >
            Start Creating Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 VidAI Studio. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
