import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white font-sans overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 h-screen scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full max-w-5xl mx-auto p-4 md:p-8 lg:p-12"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
