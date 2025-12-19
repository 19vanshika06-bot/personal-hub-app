import { useState } from "react";
import { motion } from "framer-motion";
import { useProgress, useUpdateProgress } from "@/hooks/use-progress";
import { Layout } from "@/components/Layout";
import { NeonButton } from "@/components/NeonButton";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

export default function Dashboard() {
  const { data: progressList } = useProgress();
  const updateProgress = useUpdateProgress();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Default to 0 if not found
  const currentProgress = progressList?.find(p => p.category === "Chapter 1 Progress")?.value ?? 0;

  const handleProgressChange = (vals: number[]) => {
    updateProgress.mutate({ category: "Chapter 1 Progress", value: vals[0] });
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Mock upload delay
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Syllabus Uploaded",
        description: "Your syllabus has been successfully analyzed.",
        variant: "default",
        className: "bg-card border-primary/20 text-white"
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <header>
          <h1 className="text-4xl md:text-5xl font-display mb-2">
            Hello, <span className="neon-gradient-text">Creator</span>
          </h1>
          <p className="text-muted-foreground text-lg">Let's make today productive.</p>
        </header>

        {/* Progress Card */}
        <motion.div 
          className="glass-card rounded-3xl p-8 relative overflow-hidden group"
          whileHover={{ y: -5 }}
        >
          <div className="absolute top-0 right-0 p-32 bg-[#FF007A]/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Current Progress</h2>
                <p className="text-sm text-muted-foreground">Chapter 1 • Introduction to Logic</p>
              </div>
              <span className="text-4xl font-display font-black neon-gradient-text">{currentProgress}%</span>
            </div>

            <Slider
              defaultValue={[currentProgress]}
              value={[currentProgress]}
              max={100}
              step={1}
              onValueChange={handleProgressChange}
              className="py-4"
            />
            
            <div className="mt-4 flex justify-between text-xs text-muted-foreground font-mono uppercase tracking-widest">
              <span>Start</span>
              <span>Complete</span>
            </div>
          </div>
        </motion.div>

        {/* Syllabus Upload */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2 border-white/10 hover:border-[#833AB4]/50 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
              <UploadCloud className="w-8 h-8 text-[#833AB4]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Upload Syllabus</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-[200px] mx-auto">
                Drag and drop your course PDF here to auto-generate tasks.
              </p>
            </div>
            <NeonButton onClick={handleUpload} disabled={isUploading} variant="secondary">
              {isUploading ? "Uploading..." : "Select File"}
            </NeonButton>
          </motion.div>

          {/* Quick Stats */}
          <div className="glass-card rounded-3xl p-8 flex flex-col justify-between">
            <h3 className="text-xl font-bold mb-4">Daily Goals</h3>
            <div className="space-y-4">
              {[
                { label: "Morning Review", done: true },
                { label: "Practice Problems", done: false },
                { label: "Evening Journal", done: false },
              ].map((goal, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center border
                    ${goal.done 
                      ? "bg-gradient-to-r from-[#FF007A] to-[#833AB4] border-transparent" 
                      : "border-white/30 bg-transparent"}
                  `}>
                    {goal.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className={goal.done ? "text-white/50 line-through" : "text-white"}>
                    {goal.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
