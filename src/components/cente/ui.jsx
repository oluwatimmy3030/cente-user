// src/components/cente/ui.jsx
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  Gem,
  Landmark,
  RefreshCw,
} from "lucide-react";
import { chartSeries, formatMoney } from "@/data/mock-data";

/* -------------------------------------------------------------------------- */
/*  PageTitle                                                                 */
/* -------------------------------------------------------------------------- */

export function PageTitle({ eyebrow, title, copy }) {
  return (
    <div className="mb-6 min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">
        {eyebrow}
      </p>
      <h1 className="mt-1 truncate font-display text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
        {title}
      </h1>
      {copy && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {copy}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  StatusBadge — short, never wraps                                          */
/* -------------------------------------------------------------------------- */

const STATUS_MAP = {
  Completed: {
    label: "Done",
    cls: "bg-success/12 text-success ring-success/20",
  },
  Pending: {
    label: "Pending",
    cls: "bg-warning/12 text-warning ring-warning/20",
  },
  Failed: {
    label: "Failed",
    cls: "bg-destructive/12 text-destructive ring-destructive/20",
  },
  Cancelled: {
    label: "Cancelled",
    cls: "bg-muted text-muted-foreground ring-border/60",
  },
};

export function StatusBadge({ status }) {
  const meta =
    STATUS_MAP[status] ??
    (status
      ? { label: String(status), cls: "bg-muted text-muted-foreground ring-border/60" }
      : { label: "—", cls: "bg-muted text-muted-foreground ring-border/60" });

  return (
    <span
      title={String(status ?? "")}
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ring-1 ${meta.cls}`}
    >
      {meta.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  TransactionRow — mobile-safe grid                                         */
/* -------------------------------------------------------------------------- */

function pickIcon(category) {
  switch (category) {
    case "Money In":
      return ArrowDownLeft;
    case "Gold":
      return Gem;
    case "Wealth":
      return Landmark;
    case "Swap":
      return RefreshCw;
    default:
      return ArrowUpRight;
  }
}

export function TransactionRow({ tx, onClick }) {
  const Icon = pickIcon(tx.category);
  const positive = tx.amount > 0;
  const amountText = `${positive ? "+" : "−"}${formatMoney(
    Math.abs(tx.amount),
    tx.currency,
  )}`;
  const subtitle = [tx.date, tx.subtitle].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 px-3 py-3 text-left transition-colors last:border-0 hover:bg-muted/40 sm:px-4"
    >
      {/* Icon */}
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary sm:size-11">
        <Icon className="size-4 sm:size-4.5" />
      </span>

      {/* Title + subtitle — truncate, never push amount off-screen */}
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium leading-tight">
          {tx.title}
        </span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground sm:text-xs">
            {subtitle}
          </span>
        )}
      </span>

      {/* Amount + status */}
      <span className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={[
            "whitespace-nowrap text-sm font-semibold tabular-nums leading-none",
            positive ? "text-success" : "text-foreground",
          ].join(" ")}
        >
          {amountText}
        </span>
        <StatusBadge status={tx.status} />
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  MiniChart — responsive, no fixed height jump                              */
/* -------------------------------------------------------------------------- */

export function MiniChart({ tone = "gold" }) {
  const safeSeries = Array.isArray(chartSeries) && chartSeries.length > 1
    ? chartSeries
    : [0, 0];

  const max = Math.max(...safeSeries, 1);
  const min = Math.min(...safeSeries, 0);
  const range = max - min || 1;

  const points = safeSeries
    .map((v, i) => {
      const x = (i / (safeSeries.length - 1)) * 100;
      const y = 42 - ((v - min) / range) * 38 - 2; // pad top/bottom
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const stroke = tone === "gold" ? "var(--primary)" : "var(--success)";
  const gradId = `area-${tone}`;

  return (
    <div
      className="h-24 w-full sm:h-28"
      aria-label="Performance chart"
      role="img"
    >
      <svg
        viewBox="0 0 100 45"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={stroke} stopOpacity=".28" />
            <stop offset="1" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M ${points} L 100 45 L 0 45 Z`} fill={`url(#${gradId})`} />
        <polyline
          points={points}
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  AssetIcon                                                                 */
/* -------------------------------------------------------------------------- */

export function AssetIcon({ currency, size = "md" }) {
  const dims =
    size === "lg"
      ? "size-12 text-lg"
      : size === "sm"
        ? "size-9 text-sm"
        : "size-11 text-base";

  const content =
    currency === "GOLD" ? (
      <Gem className="size-5" />
    ) : currency === "NGN" ? (
      <span className="font-bold leading-none">₦</span>
    ) : (
      <CircleDollarSign className="size-5" />
    );

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-lg bg-secondary text-primary ${dims}`}
      aria-label={currency}
    >
      {content}
    </span>
  );
}