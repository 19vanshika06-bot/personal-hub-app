import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { Layout } from "@/components/Layout";
import { useCalendar, useUpdateCalendar } from "@/hooks/use-calendar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { Check } from "lucide-react";

export default function CalendarPage() {
  const { data: days } = useCalendar();
  const updateCalendar = useUpdateCalendar();
  
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const isAlreadyProductive = days?.find(d => d.date === dateStr)?.isProductive;
    
    updateCalendar.mutate({
      date: dateStr,
      isProductive: !isAlreadyProductive
    }, {
      onSuccess: () => {
        if (!isAlreadyProductive) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF007A', '#833AB4', '#FFFFFF']
          });
        }
      }
    });
  };

  const isDayProductive = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return days?.find(d => d.date === dateStr)?.isProductive;
  };

  return (
    <Layout>
      <div className="space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display mb-1">{format(today, "MMMM")}</h1>
            <p className="text-muted-foreground">{format(today, "yyyy")}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-display font-bold neon-gradient-text">
              {days?.filter(d => d.isProductive).length || 0}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Productive Days</div>
          </div>
        </header>

        <div className="glass-card p-6 md:p-8 rounded-3xl">
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-mono text-muted-foreground py-2">
                {day}
              </div>
            ))}
            
            {calendarDays.map((day, i) => {
              const productive = isDayProductive(day);
              const isToday = isSameDay(day, today);
              
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300",
                    isToday ? "ring-2 ring-white/50" : "hover:bg-white/5",
                    productive 
                      ? "bg-gradient-to-br from-[#FF007A] to-[#833AB4] shadow-lg shadow-[#FF007A]/20" 
                      : "bg-white/5 text-white/70"
                  )}
                >
                  <span className={cn("text-sm font-medium", productive && "text-white")}>
                    {format(day, "d")}
                  </span>
                  {productive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-1 md:bottom-2"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#FF007A] to-[#833AB4]" />
            <span className="text-sm text-muted-foreground">Tap a date to mark it productive</span>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
