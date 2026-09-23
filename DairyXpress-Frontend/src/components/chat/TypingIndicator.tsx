import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-3.5 w-3.5" /></span>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-cream-300 bg-white px-4 py-3 shadow-sm" aria-label="Moo is typing">
        {[0, 1, 2].map((dot) => <motion.span key={dot} animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.7, repeat: Infinity, delay: dot * 0.12 }} className="h-1.5 w-1.5 rounded-full bg-primary" />)}
      </div>
    </motion.div>
  );
}
