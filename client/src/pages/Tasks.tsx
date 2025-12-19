import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Circle, CheckCircle2 } from "lucide-react";
import { NeonButton } from "@/components/NeonButton";
import { Input } from "@/components/ui/input";

export default function Tasks() {
  const { data: tasks } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    createTask.mutate({
      title: newTaskTitle,
      category: "Chapter 1",
      isCompleted: false
    });
    setNewTaskTitle("");
    setIsAdding(false);
  };

  const completedCount = tasks?.filter(t => t.isCompleted).length || 0;
  const totalCount = tasks?.length || 0;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <Layout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display mb-2">Tasks</h1>
            <p className="text-muted-foreground">Chapter 1 • {progressPercent}% Complete</p>
          </div>
          <NeonButton onClick={() => setIsAdding(!isAdding)} variant="secondary" className="w-12 h-12 rounded-full p-0 flex items-center justify-center">
            <Plus className={`w-6 h-6 transition-transform duration-300 ${isAdding ? "rotate-45" : ""}`} />
          </NeonButton>
        </header>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#FF007A] to-[#833AB4]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              onSubmit={handleSubmit}
            >
              <div className="flex gap-2">
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-[#FF007A]"
                  autoFocus
                />
                <NeonButton type="submit">Add</NeonButton>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tasks?.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group flex items-center gap-4 p-4 glass-card rounded-2xl hover:bg-white/10 transition-colors"
              >
                <button 
                  onClick={() => updateTask.mutate({ id: task.id, isCompleted: !task.isCompleted })}
                  className="flex-shrink-0"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-[#FF007A]" />
                  ) : (
                    <Circle className="w-6 h-6 text-white/30 group-hover:text-white/70" />
                  )}
                </button>
                
                <span className={`flex-1 font-medium transition-colors ${task.isCompleted ? "text-white/30 line-through decoration-white/30" : "text-white"}`}>
                  {task.title}
                </span>

                <button 
                  onClick={() => deleteTask.mutate(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-white/30 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {tasks?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No tasks yet. Time to get to work!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
