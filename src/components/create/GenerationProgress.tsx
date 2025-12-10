import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GenerationStep } from "@/types/video";

interface GenerationProgressProps {
  steps: GenerationStep[];
  currentStep: number;
}

const GenerationProgress = ({ steps, currentStep }: GenerationProgressProps) => {
  return (
    <div className="glass-strong rounded-2xl p-8">
      <div className="text-center mb-8">
        <h3 className="font-display font-bold text-2xl mb-2">
          Creating Your Video
        </h3>
        <p className="text-muted-foreground">
          AI is working its magic. This usually takes 2-5 minutes.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl transition-all duration-500",
              step.status === 'active' && "bg-primary/10 border border-primary/30",
              step.status === 'completed' && "opacity-70"
            )}
          >
            {/* Icon */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              step.status === 'completed' && "bg-green-500/20 text-green-500",
              step.status === 'active' && "bg-primary/20",
              step.status === 'pending' && "bg-muted"
            )}>
              {step.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : step.status === 'active' ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h4 className={cn(
                "font-medium",
                step.status === 'pending' && "text-muted-foreground"
              )}>
                {step.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>

            {/* Status Badge */}
            {step.status === 'active' && (
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium animate-pulse">
                In Progress
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Step {currentStep} of {steps.length}</span>
          <span>{Math.round((currentStep / steps.length) * 100)}% complete</span>
        </div>
      </div>
    </div>
  );
};

export default GenerationProgress;
