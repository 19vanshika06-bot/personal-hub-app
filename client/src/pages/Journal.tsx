import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useJournal, useCreateJournal } from "@/hooks/use-journal";
import { motion } from "framer-motion";
import { NeonButton } from "@/components/NeonButton";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";

export default function Journal() {
  const { data: entries } = useJournal();
  const createEntry = useCreateJournal();
  
  const [content, setContent] = useState("");
  const [moodValue, setMoodValue] = useState([50]);

  const getMoodEmoji = (val: number) => {
    if (val < 20) return "😫";
    if (val < 40) return "😔";
    if (val < 60) return "😐";
    if (val < 80) return "🙂";
    return "🤩";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createEntry.mutate({
      content,
      mood: getMoodEmoji(moodValue[0])
    }, {
      onSuccess: () => {
        setContent("");
        setMoodValue([50]);
      }
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <header>
          <h1 className="text-4xl font-display mb-2">Journal</h1>
          <p className="text-muted-foreground">Reflect on your journey.</p>
        </header>

        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted-foreground">How are you feeling?</label>
              <span className="text-4xl animate-bounce">{getMoodEmoji(moodValue[0])}</span>
            </div>
            <Slider
              value={moodValue}
              onValueChange={setMoodValue}
              max={100}
              step={1}
              className="py-2"
            />
          </div>

          <Textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="bg-white/5 border-white/10 min-h-[150px] text-lg rounded-xl focus-visible:ring-[#FF007A] resize-none"
          />

          <div className="flex justify-end">
            <NeonButton type="submit" disabled={!content.trim() || createEntry.isPending}>
              {createEntry.isPending ? "Saving..." : "Save Entry"}
            </NeonButton>
          </div>
        </form>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold px-2">Recent Entries</h2>
          <div className="grid gap-4">
            {entries?.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-2xl" role="img" aria-label="mood">{entry.mood}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {entry.createdAt && format(new Date(entry.createdAt), "MMM d, yyyy • h:mm a")}
                  </span>
                </div>
                <p className="text-white/80 whitespace-pre-line leading-relaxed">{entry.content}</p>
              </motion.div>
            ))}
            
            {entries?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No entries yet. Start writing above.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
