import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import PromptInput from "@/components/create/PromptInput";
import VoiceSelector from "@/components/create/VoiceSelector";
import StyleSelector from "@/components/create/StyleSelector";
import DurationSelector from "@/components/create/DurationSelector";
import ScriptPreview from "@/components/create/ScriptPreview";
import SEOPanel from "@/components/create/SEOPanel";
import GenerationProgress from "@/components/create/GenerationProgress";
import VideoPreview from "@/components/create/VideoPreview";
import { cn } from "@/lib/utils";
import type { SEOData, GenerationStep } from "@/types/video";

const steps = [
  { id: 1, label: "Prompt" },
  { id: 2, label: "Customize" },
  { id: 3, label: "Review" },
  { id: 4, label: "Generate" },
  { id: 5, label: "Publish" },
];

const generationSteps: GenerationStep[] = [
  { id: 1, title: "Analyzing Prompt", description: "Understanding your video requirements", status: "pending" },
  { id: 2, title: "Generating Script", description: "Writing engaging content for your video", status: "pending" },
  { id: 3, title: "Selecting Visuals", description: "Matching images and footage to your script", status: "pending" },
  { id: 4, title: "Creating Voiceover", description: "Synthesizing natural voice narration", status: "pending" },
  { id: 5, title: "Rendering Video", description: "Combining all elements into final video", status: "pending" },
];

const CreatePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("aria");
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [duration, setDuration] = useState(60);
  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCurrentStep, setGenerationCurrentStep] = useState(0);
  const [seoData, setSeoData] = useState<SEOData>({
    title: "",
    description: "",
    tags: [],
    thumbnail_suggestions: [],
  });

  const handlePromptSubmit = async (submittedPrompt: string) => {
    setPrompt(submittedPrompt);
    setIsGenerating(true);
    
    // Simulate script generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedScript = `Welcome to this quick guide on ${submittedPrompt.toLowerCase()}.

In today's video, we'll walk through everything you need to know, step by step. Whether you're a complete beginner or looking to refine your skills, this tutorial has something for everyone.

Let's dive right in and get started with the basics. First, we'll cover the essential foundations that every practitioner should know.

Next, we'll move on to some more advanced techniques that will really elevate your results. Pay close attention to these tips—they're the secret sauce that separates good from great.

Finally, we'll wrap up with some pro tips and common mistakes to avoid. These insights come from years of experience and will save you countless hours of trial and error.

Thanks for watching! Don't forget to like and subscribe for more content like this.`;

    setScript(generatedScript);
    
    // Generate SEO data
    const words = submittedPrompt.split(' ').slice(0, 5);
    setSeoData({
      title: `${submittedPrompt.slice(0, 50)} | Complete Guide`,
      description: `Learn ${submittedPrompt.toLowerCase()} in this comprehensive tutorial. Perfect for beginners and experts alike. Watch now!`,
      tags: words.map(w => w.toLowerCase()).concat(['tutorial', 'howto', 'guide', 'tips', 'learn']),
      thumbnail_suggestions: [
        `Bold text overlay: "${words.slice(0, 3).join(' ').toUpperCase()}"`,
        "Split image showing before/after results",
        "Close-up action shot with vibrant background",
      ],
    });
    
    setIsGenerating(false);
    setCurrentStep(2);
  };

  const handleGenerate = async () => {
    setCurrentStep(4);
    setGenerationCurrentStep(0);
    
    // Simulate generation progress
    for (let i = 1; i <= generationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGenerationCurrentStep(i);
    }
    
    setCurrentStep(5);
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PromptInput onSubmit={handlePromptSubmit} isLoading={isGenerating} />;
      
      case 2:
        return (
          <div className="space-y-8">
            <ScriptPreview 
              script={script} 
              onUpdate={setScript}
              onRegenerate={() => handlePromptSubmit(prompt)}
              isLoading={isGenerating}
            />
            <div className="grid lg:grid-cols-2 gap-8">
              <VoiceSelector 
                selectedVoice={selectedVoice} 
                onSelect={setSelectedVoice} 
              />
              <StyleSelector 
                selectedStyle={selectedStyle} 
                onSelect={setSelectedStyle} 
              />
            </div>
            <DurationSelector 
              duration={duration} 
              onChange={setDuration} 
            />
          </div>
        );
      
      case 3:
        return (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Video Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Voice</span>
                    <span className="font-medium capitalize">{selectedVoice}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Style</span>
                    <span className="font-medium capitalize">{selectedStyle}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Word Count</span>
                    <span className="font-medium">{script.split(/\s+/).length} words</span>
                  </div>
                </div>
              </div>
              <ScriptPreview 
                script={script} 
                onUpdate={setScript}
                onRegenerate={() => handlePromptSubmit(prompt)}
              />
            </div>
            <SEOPanel 
              seoData={seoData} 
              onUpdate={setSeoData}
              onRegenerate={() => {}}
            />
          </div>
        );
      
      case 4:
        const activeSteps = generationSteps.map((step, i) => ({
          ...step,
          status: i < generationCurrentStep ? 'completed' as const : 
                  i === generationCurrentStep ? 'active' as const : 'pending' as const
        }));
        return <GenerationProgress steps={activeSteps} currentStep={generationCurrentStep} />;
      
      case 5:
        return (
          <div className="space-y-8">
            <VideoPreview 
              title={seoData.title}
            />
            <SEOPanel 
              seoData={seoData} 
              onUpdate={setSeoData}
              onRegenerate={() => {}}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  disabled={step.id > currentStep}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                    currentStep === step.id && "bg-primary text-primary-foreground",
                    currentStep > step.id && "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30",
                    currentStep < step.id && "text-muted-foreground"
                  )}
                >
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    currentStep === step.id && "bg-primary-foreground/20",
                    currentStep > step.id && "bg-primary",
                    currentStep < step.id && "bg-muted"
                  )}>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </span>
                  <span className="hidden sm:inline font-medium">{step.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "w-8 h-0.5 mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-5xl mx-auto">
          {getStepContent()}
        </div>

        {/* Navigation */}
        {currentStep > 1 && currentStep < 4 && (
          <div className="max-w-5xl mx-auto mt-8 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              variant="gradient"
              onClick={() => currentStep === 3 ? handleGenerate() : setCurrentStep(currentStep + 1)}
            >
              {currentStep === 3 ? 'Generate Video' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default CreatePage;
