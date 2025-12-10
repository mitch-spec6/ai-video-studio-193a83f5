import { Sparkles, Video, BarChart3, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar = ({ currentPage, onNavigate }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Sparkles },
    { id: "create", label: "Create Video", icon: Video },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary transition-all duration-300 group-hover:scale-110">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">
              VidAI Studio
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "glass" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "gap-2 transition-all duration-300",
                  currentPage === item.id && "border-primary/30"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              variant="gradient" 
              size="sm"
              onClick={() => onNavigate("create")}
            >
              Start Creating
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "glass" : "ghost"}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start gap-3"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              ))}
              <Button 
                variant="gradient" 
                className="mt-2"
                onClick={() => {
                  onNavigate("create");
                  setMobileMenuOpen(false);
                }}
              >
                Start Creating
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
