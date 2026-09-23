const DEFAULT_ACTIONS = ['Delivery time', 'Track order', 'Offers', 'Refund', 'Subscription', 'Payment', 'Delivery charges'];

type QuickActionsProps = {
  onSelect: (message: string) => void;
  disabled?: boolean;
};

export function QuickActions({ onSelect, disabled = false }: QuickActionsProps) {
  return (
    <div className="pt-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Quick help</p>
      <div className="flex flex-wrap gap-2">
        {DEFAULT_ACTIONS.map((action) => (
          <button key={action} type="button" onClick={() => onSelect(action)} disabled={disabled} className="rounded-full border border-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-primary transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
