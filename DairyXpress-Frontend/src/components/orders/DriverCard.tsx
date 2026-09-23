import { MessageCircle, Phone, Star } from 'lucide-react';

export function DriverCard() {
  const openSupportChat = () => window.dispatchEvent(new CustomEvent('dairyxpress:open-chat'));

  return (
    <section className="rounded-3xl border border-cream-300 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 font-heading font-bold text-primary">DX</div>
        <div className="min-w-0 flex-1">
          <p className="font-heading font-bold text-ink">DairyXpress rider</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500"><Star className="h-3.5 w-3.5 fill-accent text-accent" />4.9 rider rating</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-500">Your rider details are confirmed when the order is dispatched.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href="tel:+919000000000" className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"><Phone className="h-3.5 w-3.5" />Call support</a>
        <button type="button" onClick={openSupportChat} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white shadow-card transition hover:bg-primary-700"><MessageCircle className="h-3.5 w-3.5" />Chat</button>
      </div>
    </section>
  );
}
