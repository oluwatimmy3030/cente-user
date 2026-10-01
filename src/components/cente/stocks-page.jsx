// src/components/cente/stocks-page.jsx
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Search,
  TrendingUp,
  Briefcase,
  BarChart3,
  Globe2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTitle, StatusBadge } from "./ui";
import { formatMoney, holdings, shareOrders, stocks } from "@/data/mock-data";

/* -------------------------------------------------------------------------- */
/*  Tabs                                                                      */
/* -------------------------------------------------------------------------- */

const TABS = [
  {
    key: "US",
    label: "US Stocks",
    shortLabel: "US",
    icon: Globe2,
    ring: "ring-sky-500/30",
    accent: "from-sky-500/15 to-sky-500/0",
  },
  {
    key: "ALL",
    label: "Stocks & Shares",
    shortLabel: "All",
    icon: Layers,
    ring: "ring-violet-500/30",
    accent: "from-violet-500/15 to-violet-500/0",
  },
];

const VALID_KEYS = TABS.map((t) => t.key);

// A stock is considered "US" if it's quoted in USD and not marked as
// a local (NGN) listing. Adjust this predicate to match your data shape.
function isUSStock(s) {
  if (s.market) return String(s.market).toUpperCase() === "US";
  return (s.currency ?? "USD") === "USD";
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function StocksPage() {
  const [tab, setTab] = useState("US");
  const [query, setQuery] = useState("");

  const pool = useMemo(() => {
    if (tab === "US") return stocks.filter(isUSStock);
    return stocks;
  }, [tab]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter((s) =>
      `${s.symbol} ${s.name}`.toLowerCase().includes(q),
    );
  }, [pool, query]);

  const activeTab = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-20 sm:space-y-8 [contain:layout]">
      <PageTitle
        eyebrow="Invest"
        title="Stocks & Shares"
        copy="Explore a mock investment portfolio designed for a future connected trading experience."
      />

      {/* ---------------------------------------------------------------- */}
      {/*  Tab switcher                                                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="rounded-2xl border border-border/70 bg-card p-3 shadow-sm">
        <div
          role="tablist"
          aria-label="Market"
          className="grid h-11 w-full grid-cols-2 gap-1 rounded-xl bg-muted/50 p-1 sm:w-96"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={[
                  "inline-flex h-9 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-medium leading-none transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm ring-1 " + t.ring
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <Icon className={`size-4 shrink-0 ${active ? "" : "opacity-70"}`} />
                <span className="truncate sm:hidden">{t.shortLabel}</span>
                <span className="hidden truncate sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Portfolio summary (always visible)                               */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        {/* Portfolio card */}
        <div className="balance-card overflow-hidden rounded-2xl p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/65">
            Portfolio value
          </p>
          <h2 className="mt-2 truncate font-display text-3xl font-semibold text-primary-foreground sm:text-4xl">
            $1,303.05
          </h2>
          <p className="mt-2 flex items-center gap-1 text-sm text-success">
            <TrendingUp className="size-4 shrink-0" />
            <span className="truncate">+$115.90 all time</span>
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs sm:mt-8">
            <div className="min-w-0 rounded-lg bg-background/14 p-3 text-primary-foreground">
              <span className="block opacity-65">Invested</span>
              <strong className="mt-1 block truncate">$1,187.15</strong>
            </div>
            <div className="min-w-0 rounded-lg bg-background/14 p-3 text-primary-foreground">
              <span className="block opacity-65">Holdings</span>
              <strong className="mt-1 block truncate">2 assets</strong>
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div className="panel overflow-hidden p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="truncate text-base font-semibold sm:text-lg">
              Your Holdings
            </h2>
            <Briefcase className="size-4 shrink-0 text-muted-foreground/60" />
          </div>

          {holdings.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No holdings yet
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {holdings.map((h) => (
                <HoldingRow key={h.symbol} holding={h} />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Explore Markets — content driven by the active tab                */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <BarChart3 className="size-4 shrink-0 text-muted-foreground/60" />
            <h2 className="truncate text-base font-semibold sm:text-lg">
              {tab === "US" ? "US Markets" : "All Markets"}
            </h2>
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {shown.length}
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder={tab === "US" ? "Search US stocks" : "Search all stocks"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="panel flex flex-col items-center gap-2 py-12 text-center">
            <Search className="size-6 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {query
                ? `No stocks match "${query}"`
                : tab === "US"
                  ? "No US stocks available"
                  : "No stocks available"}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {shown.map((s) => (
              <StockCard key={s.symbol} stock={s} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Share Orders                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="panel overflow-hidden p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="truncate text-base font-semibold sm:text-lg">
            Share Orders
          </h2>
          <Button variant="outline" size="sm" disabled className="shrink-0">
            New Order
          </Button>
        </div>

        {shareOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No orders yet
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {shareOrders.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </ul>
        )}

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Market data and orders are mock examples. No brokerage is connected.
        </p>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function HoldingRow({ holding }) {
  const positive = holding.return >= 0;
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-bold text-primary">
        {holding.symbol.slice(0, 2)}
      </span>

      <div className="min-w-0">
        <strong className="block truncate text-sm">{holding.symbol}</strong>
        <small className="block truncate text-xs text-muted-foreground">
          {holding.shares} shares
        </small>
      </div>

      <div className="shrink-0 text-right">
        <strong className="block whitespace-nowrap text-sm tabular-nums">
          {formatMoney(holding.value, "USD")}
        </strong>
        <small
          className={[
            "block whitespace-nowrap text-xs tabular-nums",
            positive ? "text-success" : "text-destructive",
          ].join(" ")}
        >
          {positive ? "+" : "−"}
          {formatMoney(Math.abs(holding.return), "USD")}
        </small>
      </div>
    </li>
  );
}

function StockCard({ stock }) {
  const up = stock.change >= 0;
  const ChangeIcon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="panel grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 transition-colors hover:bg-muted/30">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-bold text-primary">
        {stock.symbol.slice(0, 2)}
      </span>

      <div className="min-w-0">
        <strong className="block truncate text-sm">{stock.symbol}</strong>
        <small className="block truncate text-xs text-muted-foreground">
          {stock.name}
        </small>
      </div>

      <div className="shrink-0 text-right">
        <strong className="block whitespace-nowrap text-sm tabular-nums">
          {formatMoney(stock.price, stock.currency ?? "USD")}
        </strong>
        <small
          className={[
            "flex items-center justify-end gap-0.5 whitespace-nowrap text-xs tabular-nums",
            up ? "text-success" : "text-destructive",
          ].join(" ")}
        >
          <ChangeIcon className="size-3 shrink-0" />
          {Math.abs(stock.change)}%
        </small>
      </div>
    </div>
  );
}

function OrderRow({ order }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-4">
      {/* Order title + meta */}
      <div className="min-w-0">
        <strong className="block truncate text-sm">
          {order.side} {order.symbol}
        </strong>
        <small className="block truncate text-xs text-muted-foreground">
          {order.shares} shares · {order.date}
        </small>
      </div>

      {/* Amount — its own row on mobile, second column on desktop */}
      <strong className="order-3 shrink-0 whitespace-nowrap text-right text-sm tabular-nums sm:order-none sm:text-left">
        {formatMoney(order.total, "USD")}
      </strong>

      {/* Status badge — top-right on mobile, third column on desktop */}
      <div className="order-2 shrink-0 justify-self-end sm:order-none sm:justify-self-auto">
        <StatusBadge status={order.status} />
      </div>
    </li>
  );
}