import { FormEvent, useState } from 'react';
import { CheckCircle2, Copy, Headphones, Mail, Phone, Ticket, X } from 'lucide-react';
import { api } from '@/services/api';

type ContactFooterProps = { onLiveAgent: () => void; disabled?: boolean };
const SUPPORT_PHONE = '+91 1800 123 4567';
const SUPPORT_PHONE_LINK = '+9118001234567';
const SUPPORT_EMAIL = 'support@dairyxpress.farm';
type Panel = 'call' | 'email' | 'ticket' | null;

export function ContactFooter({ onLiveAgent, disabled = false }: ContactFooterProps) {
  const [panel, setPanel] = useState<Panel>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [error, setError] = useState('');

  const copyEmail = async () => {
    await navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const submitTicket = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const ticket = await api.createSupportTicket({
        name: String(form.get('name') ?? ''), email: String(form.get('email') ?? ''),
        phone: String(form.get('phone') ?? ''), subject: String(form.get('subject') ?? ''),
        message: String(form.get('message') ?? ''),
      });
      setTicketNumber(ticket.ticketNumber);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create the ticket. Please try again.');
    } finally { setSubmitting(false); }
  };

  const closePanel = () => { setPanel(null); setTicketNumber(''); setError(''); };

  return <>
    <div className="mt-3 flex items-center justify-between gap-1 text-[11px] text-ink-500">
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => setPanel('call')} className="inline-flex items-center gap-1 rounded-lg px-1.5 py-1 transition hover:bg-cream-200 hover:text-primary"><Phone className="h-3 w-3" />Call</button>
        <button type="button" onClick={() => setPanel('email')} className="inline-flex items-center gap-1 rounded-lg px-1.5 py-1 transition hover:bg-cream-200 hover:text-primary"><Mail className="h-3 w-3" />Email</button>
        <button type="button" onClick={() => setPanel('ticket')} className="inline-flex items-center gap-1 rounded-lg px-1.5 py-1 transition hover:bg-cream-200 hover:text-primary"><Ticket className="h-3 w-3" />Ticket</button>
      </div>
      <button type="button" onClick={onLiveAgent} disabled={disabled} className="inline-flex items-center gap-1 rounded-lg px-1.5 py-1 font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-60"><Headphones className="h-3 w-3" />Live agent</button>
    </div>

    {panel && <div className="absolute inset-x-3 bottom-[4.6rem] z-10 rounded-2xl border border-cream-300 bg-white p-4 shadow-float" role="dialog" aria-modal="true" aria-label={`${panel} support`}>
      <button type="button" onClick={closePanel} className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full text-ink-400 hover:bg-cream-200" aria-label="Close support panel"><X className="h-4 w-4" /></button>
      {panel === 'call' && <div><p className="font-heading font-bold text-ink">Call DairyXpress support</p><p className="mt-1 text-xs text-ink-500">Available daily, 8:00 AM–10:00 PM</p><a href={`tel:${SUPPORT_PHONE_LINK}`} className="mt-4 flex items-center justify-between rounded-xl bg-primary/10 p-3 font-semibold text-primary"><span>{SUPPORT_PHONE}</span><Phone className="h-4 w-4" /></a></div>}
      {panel === 'email' && <div><p className="font-heading font-bold text-ink">Email DairyXpress support</p><p className="mt-1 text-xs text-ink-500">We normally respond within one business day.</p><div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/10 p-3"><a href={`mailto:${SUPPORT_EMAIL}`} className="min-w-0 flex-1 truncate font-semibold text-primary">{SUPPORT_EMAIL}</a><button type="button" onClick={() => void copyEmail()} className="rounded-lg p-1.5 text-primary hover:bg-white" aria-label="Copy email"><Copy className="h-4 w-4" /></button></div>{copied && <p className="mt-2 text-xs font-semibold text-success">Email copied</p>}</div>}
      {panel === 'ticket' && (ticketNumber ? <div className="py-3 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-success" /><p className="mt-3 font-heading font-bold text-ink">Ticket raised successfully</p><p className="mt-1 text-sm text-ink-500">Your ticket number is <strong className="text-ink">{ticketNumber}</strong>.</p><button type="button" onClick={closePanel} className="btn-primary mt-4 px-5 py-2 text-sm">Done</button></div> : <form onSubmit={submitTicket} className="space-y-2.5"><div><p className="font-heading font-bold text-ink">Raise a support ticket</p><p className="text-xs text-ink-500">Tell us what went wrong and we’ll follow up.</p></div><div className="grid grid-cols-2 gap-2"><input name="name" required maxLength={80} placeholder="Your name" className="rounded-xl border border-cream-300 px-3 py-2 text-xs outline-none focus:border-primary" /><input name="phone" maxLength={20} placeholder="Phone (optional)" className="rounded-xl border border-cream-300 px-3 py-2 text-xs outline-none focus:border-primary" /></div><input name="email" type="email" required maxLength={120} placeholder="Email address" className="w-full rounded-xl border border-cream-300 px-3 py-2 text-xs outline-none focus:border-primary" /><input name="subject" required maxLength={120} placeholder="Subject" className="w-full rounded-xl border border-cream-300 px-3 py-2 text-xs outline-none focus:border-primary" /><textarea name="message" required minLength={10} maxLength={2000} rows={3} placeholder="Describe your issue" className="w-full resize-none rounded-xl border border-cream-300 px-3 py-2 text-xs outline-none focus:border-primary" />{error && <p className="text-xs text-error">{error}</p>}<button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-2 text-sm disabled:opacity-60">{submitting ? 'Raising ticket…' : 'Raise ticket'}</button></form>)}
    </div>}
  </>;
}
