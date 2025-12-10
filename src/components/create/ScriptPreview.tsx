import { useState } from "react";
import { FileText, Edit3, Check, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScriptPreviewProps {
  script: string;
  onUpdate: (script: string) => void;
  onRegenerate: () => void;
  isLoading?: boolean;
}

const ScriptPreview = ({ script, onUpdate, onRegenerate, isLoading }: ScriptPreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState(script);

  const handleSave = () => {
    onUpdate(editedScript);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedScript(script);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg">Generated Script</h3>
            <p className="text-sm text-muted-foreground">Review and edit your video script</p>
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button variant="gradient" size="sm" onClick={handleSave}>
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRegenerate}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Script Content */}
      <div className="glass-strong rounded-xl p-6">
        {isEditing ? (
          <textarea
            value={editedScript}
            onChange={(e) => setEditedScript(e.target.value)}
            className="w-full h-64 bg-transparent text-foreground focus:outline-none resize-none leading-relaxed"
          />
        ) : (
          <div className="prose prose-invert max-w-none">
            {script.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-foreground/90 leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Word Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{script.split(/\s+/).length} words</span>
        <span>~{Math.ceil(script.split(/\s+/).length / 150)} min read</span>
      </div>
    </div>
  );
};

export default ScriptPreview;
