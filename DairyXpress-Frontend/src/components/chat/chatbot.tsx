import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { api } from '@/services/api';
import { ContactFooter } from './ContactFooter';
import { MessageBubble, type ChatMessage } from './MessageBubble';
import { QuickActions } from './QuickActions';
import { TypingIndicator } from './TypingIndicator';

const initialMessage: ChatMessage = {
  id: 1,
  from: 'bot',
  text: "Hi! I'm Moo, your DairyXpress assistant. I can help with deliveries, orders, subscriptions, and payments.",
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 180);
  }, [open]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending, open]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    const openFromSupportAction = () => setOpen(true);
    window.addEventListener('dairyxpress:open-chat', openFromSupportAction);
    return () => window.removeEventListener('dairyxpress:open-chat', openFromSupportAction);
  }, []);

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isSending) return;

    setInput('');
    setMessages((current) => [...current, { id: Date.now(), from: 'user', text: message }]);
    setIsSending(true);

    try {
      const response = await api.chat(message);
      setMessages((current) => [...current, { id: Date.now() + 1, from: 'bot', text: response.reply }]);
    } catch {
      setMessages((current) => [...current, { id: Date.now() + 1, from: 'bot', text: 'I could not connect just now. Please try again, or choose one of the support options below.' }]);
    } finally {
      setIsSending(false);
    }
  };

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {open && (
          <motion.section initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.96 }} transition={{ type: 'spring', stiffness: 360, damping: 28 }} className="relative mb-3 flex h-[min(42rem,calc(100dvh-7.5rem))] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-float backdrop-blur-xl sm:w-[24rem]" aria-label="DairyXpress assistant">
            <header className="relative flex items-center gap-3 overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 px-4 py-4 text-white">
              <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/25 bg-white/15 shadow-lg backdrop-blur"><Bot className="h-5 w-5" /><span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-blue-600 bg-success" aria-label="Online" /></div>
              <div className="relative min-w-0"><p className="font-heading font-bold">Ask Moo</p><p className="text-xs text-white/75">Online · Dairy concierge</p></div>
              <button onClick={() => setOpen(false)} className="relative ml-auto grid h-9 w-9 place-items-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:bg-white/15" aria-label="Close chat"><X className="h-5 w-5" /></button>
            </header>

            <div className="flex-1 overflow-y-auto bg-cream-100 px-4 py-5"><div className="space-y-4">
              {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
              {isSending && <TypingIndicator />}
              {messages.length === 1 && !isSending && <QuickActions onSelect={(message) => void sendMessage(message)} disabled={isSending} />}
              <div ref={messageEndRef} />
            </div></div>

            <div className="border-t border-cream-300 bg-white/90 p-3">
              <form onSubmit={send} className="flex items-center gap-2 rounded-2xl border border-cream-400 bg-cream-100/70 p-1.5 focus-within:border-primary/45 focus-within:ring-4 focus-within:ring-primary/10">
                <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about your delivery…" className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm text-ink outline-none placeholder:text-ink-400" aria-label="Chat message" disabled={isSending} />
                <button type="button" onClick={() => setInput((value) => `${value}😊`)} className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition hover:bg-white hover:text-primary" aria-label="Add emoji" disabled={isSending}>😊</button>
                <button type="submit" disabled={!input.trim() || isSending} className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white shadow-card transition hover:scale-105 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-45" aria-label="Send message"><Send className="h-4 w-4" /></button>
              </form>
              <ContactFooter onLiveAgent={() => void sendMessage('I would like to speak with a live agent.')} disabled={isSending} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button type="button" onClick={() => setOpen((value) => !value)} whileHover={{ scale: 1.07, y: -2 }} whileTap={{ scale: 0.95 }} animate={!open ? { boxShadow: ['0 12px 40px rgba(46, 125, 50, 0.12)', '0 0 0 12px rgba(46, 125, 50, 0)', '0 12px 40px rgba(46, 125, 50, 0.12)'] } : {}} transition={!open ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : {}} className="relative ml-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-float" aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}>
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-white bg-error" aria-label="New assistant message" />}
      </motion.button>
    </div>
  );
}
