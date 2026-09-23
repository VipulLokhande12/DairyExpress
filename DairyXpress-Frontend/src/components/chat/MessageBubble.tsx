import { motion } from 'framer-motion';
import { CheckCheck, Sparkles } from 'lucide-react';

export type ChatMessage = {
  id: number;
  from: 'bot' | 'user';
  text: string;
};

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.from === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-3.5 w-3.5" /></span>}
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${isUser ? 'rounded-br-md bg-primary text-white shadow-primary/15' : 'rounded-bl-md border border-cream-300 bg-white text-ink'}`}>
        {message.text}
        {isUser && <CheckCheck className="ml-2 inline h-3.5 w-3.5 text-white/75" aria-label="Sent" />}
      </div>
    </motion.div>
  );
}
