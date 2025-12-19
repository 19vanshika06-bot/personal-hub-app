import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useNotes, useCreateNote } from "@/hooks/use-notes";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NeonButton } from "@/components/NeonButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function Notes() {
  const { data: notes } = useNotes();
  const createNote = useCreateNote();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", type: "task" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNote.mutate(form, {
      onSuccess: () => {
        setIsOpen(false);
        setForm({ title: "", content: "", type: "task" });
      }
    });
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "math": return "from-blue-500/20 to-cyan-500/20 border-blue-500/30";
      case "history": return "from-amber-500/20 to-orange-500/20 border-amber-500/30";
      default: return "from-[#FF007A]/20 to-[#833AB4]/20 border-[#FF007A]/30";
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-display">Notes</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <NeonButton className="rounded-full w-12 h-12 p-0 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </NeonButton>
            </DialogTrigger>
            <DialogContent className="bg-[#121212] border-white/10 text-white sm:rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">New Note</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  placeholder="Title" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
                <Select value={form.type} onValueChange={val => setForm({...form, type: val})}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="task">General</SelectItem>
                    <SelectItem value="math">Math</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea 
                  placeholder="Content..." 
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                  className="bg-white/5 border-white/10 min-h-[150px]"
                />
                <NeonButton type="submit" className="w-full">Save Note</NeonButton>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes?.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-6 rounded-3xl border bg-gradient-to-br backdrop-blur-md min-h-[200px] flex flex-col relative group cursor-pointer hover:scale-[1.02] transition-transform duration-300",
                getTypeColor(note.type)
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold line-clamp-1">{note.title}</h3>
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-50 px-2 py-1 rounded-full bg-black/20">
                  {note.type}
                </span>
              </div>
              <p className="text-white/70 line-clamp-4 flex-1 whitespace-pre-line">{note.content}</p>
            </motion.div>
          ))}

          {notes?.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p>Empty canvas. Create your first note.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
