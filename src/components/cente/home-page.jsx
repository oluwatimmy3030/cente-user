// src/components/cente/home-page.jsx
import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowRight,
  Eye,
  EyeOff,
  Gem,
  Landmark,
  ReceiptText,
  Send,
  WalletCards,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ActionFlow } from "./action-flow";
import {
  formatMoney,
  formatOunces,
  goldPrice,
  rates,
  safevestProducts,
} from "@/data/mock-data";
import { useCente } from "@/state/cente-context";
import { TransactionRow } from "./ui";
import { WelcomeGate } from "./welcome-gate";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const ACTIONS = [
  { label: "Fund Wallet",   icon: ArrowDownToLine, kind: "fund" },
  { label: "Send Money",    icon: Send,            to: "/send" },
  { label: "Transactions",  icon: ReceiptText,     to: "/transactions" },
  { label: "Safevest USD",  icon: Landmark,        to: "/wealth?product=USD" },
  { label: "Safevest NGN",  icon: WalletCards,     to: "/wealth?product=NGN" },
  { label: "Safevest Gold", icon: Gem,             to: "/wealth?product=GOLD" },
];

/* -------------------------------------------------------------------------- */
/*  Spiral background                                                         */
/* -------------------------------------------------------------------------- */

// Archimedean spiral path, built once at module load.
function buildSpiral({ cx, cy, turns, gap, step = 0.12 }) {
  const maxTheta = turns * Math.PI * 2;
  const b = gap / (Math.PI * 2);
  let d = `M ${cx} ${cy}`;
  for (let t = step; t <= maxTheta; t += step) {
    const r = b * t;
    d += ` L ${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`;
  }
  return d;
}

const SPIRAL_PATH = buildSpiral({ cx: 330, cy: 70, turns: 9, gap: 16 });

function SpiralBackground() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 260"
      preserveAspectRatio="xMaxYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <path
        d={SPIRAL_PATH}
        fill="none"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function HomePage() {
  const { balances, hidden, toggleHidden, transactions, gold, reset } = useCente();

  const [currency, setCurrency] = useState("USD");
  const [flow, setFlow] = useState(null);

  const usdValue = balances?.USD ?? 0;
  const ngnValue = balances?.NGN ?? 0;
  const ounces = gold?.ounces ?? 0;
  const goldUSD = ounces * (goldPrice?.USD ?? 0);
  const totalUSD = usdValue + ngnValue / (rates?.NGN_USD ?? 1) + goldUSD;

  const wallets = [
    { key: "USD",  label: "USD Wallet",  hint: "Available balance",     symbol: "$",  display: formatMoney(usdValue, "USD") },
    { key: "NGN",  label: "NGN Wallet",  hint: "Available balance",     symbol: "₦",  display: formatMoney(ngnValue, "NGN") },
    { key: "GOLD", label: "Gold Wallet", hint: "Safevest Gold holding", symbol: "OZ", display: formatOunces(ounces) },
  ];

  const getTotalForCurrency = (cur) => {
    if (cur === "USD") return totalUSD;
    if (cur === "NGN") return ngnValue;
    return ounces;
  };

  const formatTotal = (cur) => {
    if (hidden) return "••••••";
    if (cur === "GOLD") return formatOunces(getTotalForCurrency(cur));
    return formatMoney(getTotalForCurrency(cur), cur);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-20 sm:space-y-8 [contain:layout]">
      <WelcomeGate />

      {/* Greeting */}
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">
          Good afternoon, Samuel
        </p>
        <h1 className="mt-1 truncate font-display text-2xl font-semibold leading-tight sm:text-3xl">
          Your wealth, thoughtfully managed.
        </h1>
      </div>

      {/* Balance card + wallet breakdown */}
      <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        {/* ------------------------------------------------------------ */}
        {/*  Balance card — flat colour + single spiral line              */}
        {/* ------------------------------------------------------------ */}
        <div className="relative flex min-h-56 overflow-hidden rounded-3xl bg-[#96691a] p-5 text-white sm:p-7">
          <SpiralBackground />

          <div className="relative z-10 flex w-full flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-white/85">Total wallet balance</p>
                <p className="mt-2 truncate font-display text-3xl font-semibold tabular-nums sm:text-4xl">
                  {formatTotal(currency)}
                </p>
                <p className="mt-2 truncate text-xs text-white/80">
                  Estimated across USD, NGN and Gold. Mock rate.
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleHidden}
                aria-label={hidden ? "Show balances" : "Hide balances"}
                className="shrink-0 rounded-full bg-white/15 text-white hover:bg-white/25 hover:text-white"
              >
                {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </Button>
            </div>

            {/* Wallet switcher */}
            <div className="mt-6 flex h-10 w-full min-w-0 items-center gap-1 overflow-x-auto rounded-full bg-white/15 p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:w-fit">
              {wallets.map((w) => {
                const active = currency === w.key;
                return (
                  <button
                    key={w.key}
                    type="button"
                    onClick={() => setCurrency(w.key)}
                    aria-pressed={active}
                    className={[
                      "inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3.5 text-xs font-medium leading-none transition-colors",
                      active
                        ? "bg-white text-[#7a5a0f]"
                        : "text-white/85 hover:bg-white/15 hover:text-white",
                    ].join(" ")}
                  >
                    {w.key}
                  </button>
                );
              })}
            </div>

            {/* Currency detail + Fund */}
            <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
              <div className="min-w-0">
                <p className="text-xs text-white/85">{currency} balance</p>
                <p className="mt-1 truncate text-xl font-semibold tabular-nums">
                  {formatTotal(currency)}
                </p>
              </div>

              <Button
                onClick={() => setFlow({ kind: "fund", currency })}
                className="shrink-0 rounded-full bg-white text-[#7a5a0f] hover:bg-white/90"
              >
                <ArrowDownToLine className="size-4" />
                Fund Wallet
              </Button>
            </div>
          </div>
        </div>

        {/* Wallet breakdown */}
        <div className="panel overflow-hidden p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Wallet breakdown
            </p>
          </div>

          <div className="space-y-2">
            {wallets.map((w) => {
              const active = currency === w.key;
              return (
                <button
                  key={w.key}
                  type="button"
                  onClick={() => setCurrency(w.key)}
                  aria-pressed={active}
                  className={[
                    "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                    active
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:border-border/80 hover:bg-muted/30",
                  ].join(" ")}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-sm font-bold text-primary">
                    {w.key === "GOLD" ? <Gem className="size-4" /> : w.symbol}
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate text-sm">{w.label}</strong>
                    <small className="block truncate text-xs text-muted-foreground">
                      {w.hint}
                    </small>
                  </span>
                  <strong className="shrink-0 whitespace-nowrap text-right text-sm tabular-nums">
                    {hidden ? "••••" : w.display}
                  </strong>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 truncate text-base font-semibold sm:text-lg">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
          {ACTIONS.map((a) => {
            const Icon = a.icon;
            const inner = (
              <>
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4 sm:size-4.5" />
                </span>
                <span className="line-clamp-2 text-center text-[11px] font-semibold leading-tight">
                  {a.label}
                </span>
              </>
            );
            const className =
              "panel flex min-h-24 min-w-0 flex-col items-center justify-center gap-2 p-2.5 text-center transition-colors hover:border-primary/40 hover:bg-muted/30 sm:min-h-25 sm:p-3";

            return a.to ? (
              <Link key={a.label} to={a.to} className={className}>
                {inner}
              </Link>
            ) : (
              <button
                key={a.label}
                type="button"
                onClick={() => setFlow({ kind: a.kind, currency })}
                className={className}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent activity + Safevest products */}
      <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="panel overflow-hidden p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="truncate text-base font-semibold sm:text-lg">
              Recent activity
            </h2>
            <Link
              to="/transactions"
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {transactions.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No recent activity
            </p>
          ) : (
            <div className="-mx-1">
              {transactions.slice(0, 4).map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="truncate text-base font-semibold sm:text-lg">
              Safevest
            </h2>
            <TrendingUp className="size-4 shrink-0 text-muted-foreground/60" />
          </div>

          <div className="space-y-2.5">
            {safevestProducts.map((p) => (
              <Link
                key={p.id}
                to={`/wealth?product=${p.id}`}
                className="panel grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3.5 transition-colors hover:border-primary/40 hover:bg-muted/30 sm:p-4"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary sm:size-11">
                  <Landmark className="size-4" />
                </span>
                <span className="min-w-0">
                  <strong className="block truncate text-sm">{p.name}</strong>
                  <small className="block truncate text-xs text-muted-foreground">
                    {p.rate}
                  </small>
                </span>
                <strong className="shrink-0 whitespace-nowrap text-right text-sm tabular-nums">
                  {formatMoney(p.balance, p.currency)}
                </strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reset demo */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={reset}
          className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground underline transition-colors hover:text-foreground"
        >
          Reset demo data
        </button>
      </div>

      <ActionFlow
        kind={flow?.kind ?? "fund"}
        presetCurrency={flow?.currency}
        open={Boolean(flow)}
        onOpenChange={(v) => !v && setFlow(null)}
      />
    </div>
  );
}