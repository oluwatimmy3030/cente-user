import { ArrowDownLeft, ArrowUpRight, CircleDollarSign, Gem, Landmark, RefreshCw } from "lucide-react";
import { chartSeries, formatMoney } from "@/data/mock-data";

export function PageTitle({ eyebrow, title, copy }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">{eyebrow}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
      {copy && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{copy}</p>}
    </div>
  );
}

export function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${status === "Completed" ? "bg-success/12 text-success" : status === "Pending" ? "bg-warning/12 text-warning" : "bg-destructive/12 text-destructive"}`}>
      {status}
    </span>
  );
}

export function TransactionRow({ tx, onClick }) {
  const Icon = tx.category === "Money In" ? ArrowDownLeft : tx.category === "Gold" ? Gem : tx.category === "Wealth" ? Landmark : tx.category === "Swaps" ? RefreshCw : ArrowUpRight;
  return (
    <button onClick={onClick} className="grid min-h-17 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 py-3 text-left last:border-0">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-4.5" /></span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{tx.title}</span>
        <span className="block truncate text-xs text-muted-foreground">{tx.date} · {tx.subtitle}</span>
      </span>
      <span className="text-right">
        <span className={`block text-sm font-semibold ${tx.amount > 0 ? "text-success" : "text-foreground"}`}>{tx.amount > 0 ? "+" : "−"}{formatMoney(tx.amount, tx.currency)}</span>
        <StatusBadge status={tx.status} />
      </span>
    </button>
  );
}

export function MiniChart({ tone = "gold" }) {
  const points = chartSeries.map((v, i) => `${(i / (chartSeries.length - 1)) * 100},${58 - v}`).join(" ");
  return (
    <div className="h-28 w-full" aria-label="Performance chart">
      <svg viewBox="0 0 100 45" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`area-${tone}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={tone === "gold" ? "var(--primary)" : "var(--success)"} stopOpacity=".28" />
            <stop offset="1" stopColor={tone === "gold" ? "var(--primary)" : "var(--success)"} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M ${points} L 100 45 L 0 45 Z`} fill={`url(#area-${tone})`} />
        <polyline points={points} fill="none" stroke={tone === "gold" ? "var(--primary)" : "var(--success)"} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export function AssetIcon({ currency }) {
  return (
    <span className="grid size-11 place-items-center rounded-lg bg-secondary text-primary">
      {currency === "GOLD" ? <Gem /> : currency === "NGN" ? <span className="font-bold">₦</span> : <CircleDollarSign />}
    </span>
  );
}
