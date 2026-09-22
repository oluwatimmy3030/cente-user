import { Link } from "react-router-dom";
import { ArrowDownToLine, ArrowRight, Eye, EyeOff, Gem, Landmark, ReceiptText, Send, WalletCards } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ActionFlow } from "./action-flow";
import { formatMoney, formatOunces, goldPrice, rates, safevestProducts } from "@/data/mock-data";
import { useCente } from "@/state/cente-context";
import { TransactionRow } from "./ui";
import { WelcomeGate } from "./welcome-gate";

const actions = [
  { label: "Fund Wallet", icon: ArrowDownToLine, kind: "fund" },
  { label: "Send Money", icon: Send, to: "/send" },
  { label: "Transactions", icon: ReceiptText, to: "/transactions" },
  { label: "Safevest USD", icon: Landmark, to: "/wealth?product=USD" },
  { label: "Safevest NGN", icon: WalletCards, to: "/wealth?product=NGN" },
  { label: "Safevest Gold", icon: Gem, to: "/wealth?product=GOLD" },
];

export function HomePage() {
  const { balances, hidden, toggleHidden, transactions, gold, reset } = useCente();
  const [currency, setCurrency] = useState("USD");
  const [flow, setFlow] = useState(null);

  const usdValue = balances?.USD ?? 0;
  const ngnValue = balances?.NGN ?? 0;
  const goldUSD = (gold?.ounces ?? 0) * (goldPrice?.USD ?? 0);
  const totalUSD = usdValue + ngnValue / (rates?.NGN_USD ?? 1) + goldUSD;

  const wallets = [
    { key: "USD", label: "USD Wallet", symbol: "$", balance: usdValue, display: formatMoney(usdValue, "USD") },
    { key: "NGN", label: "NGN Wallet", symbol: "₦", balance: ngnValue, display: formatMoney(ngnValue, "NGN") },
    { key: "GOLD", label: "Gold Wallet", symbol: "OZ", balance: gold?.ounces ?? 0, display: formatOunces(gold?.ounces ?? 0) },
  ];

  const getBalance = (key) => {
    if (hidden) return "•••••";
    if (key === "GOLD") return formatOunces(gold?.ounces ?? 0);
    return formatMoney(balances?.[key] ?? 0, key);
  };

  const getTotalForCurrency = (cur) => {
    if (cur === "USD") return totalUSD;
    if (cur === "NGN") return ngnValue;
    return gold?.ounces ?? 0;
  };

  return <>
    <WelcomeGate />
    <section>
      <div className="mb-5">
        <p className="text-sm text-muted-foreground">Good afternoon, Samuel</p>
        <h1 className="font-display text-3xl font-semibold">Your wealth, thoughtfully managed.</h1>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="balance-card relative min-h-76 overflow-hidden rounded-xl p-5 sm:p-7">
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-primary-foreground/65">Total wallet balance</p>
                <p className="mt-2 text-3xl font-semibold text-primary-foreground sm:text-4xl">
                  {hidden ? "••••••" : currency === "GOLD" ? formatOunces(getTotalForCurrency(currency)) : formatMoney(getTotalForCurrency(currency), currency)}
                </p>
                <p className="mt-2 text-xs text-primary-foreground/60">Estimated across USD, NGN and Gold · Mock rate</p>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleHidden} className="bg-background/10 text-primary-foreground hover:bg-background/20" aria-label="Toggle balance">
                {hidden ? <Eye /> : <EyeOff />}
              </Button>
            </div>
            <div className="mt-9 flex gap-2">
              {wallets.map((w) => (
                <Button
                  key={w.key}
                  variant="ghost"
                  onClick={() => setCurrency(w.key)}
                  className={currency === w.key ? "border border-primary-foreground/30 bg-primary-foreground/16 text-primary-foreground" : "border border-primary-foreground/15 text-primary-foreground/70"}
                >
                  {w.key} Wallet
                </Button>
              ))}
            </div>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-primary-foreground/60">{currency} balance</p>
                <p className="mt-1 text-xl font-semibold text-primary-foreground">
                  {hidden ? "••••" : currency === "GOLD" ? formatOunces(gold.ounces) : formatMoney(getTotalForCurrency(currency), currency)}
                </p>
              </div>
              <Button onClick={() => setFlow({ kind: "fund", currency })}>
                <ArrowDownToLine /> Fund Wallet
              </Button>
            </div>
            <button onClick={reset} className="mt-2 text-[10px] text-muted-foreground underline transition hover:text-foreground">Reset demo data</button>
          </div>
        </div>
        <div className="panel p-5">
          <p className="text-xs text-muted-foreground">Wallet breakdown</p>
          <div className="mt-4 space-y-3">
            {wallets.map((w) => (
              <button
                key={w.key}
                onClick={() => setCurrency(w.key)}
                className={`grid min-h-18 w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border p-3 text-left transition ${currency === w.key ? "border-primary/40 bg-primary/5" : "border-border"}`}
              >
                <span className="grid size-10 place-items-center rounded-lg bg-secondary font-bold text-primary">
                  {w.key === "GOLD" ? <Gem className="size-4" /> : w.symbol}
                </span>
                <span>
                  <strong className="block text-sm">{w.label}</strong>
                  <small className="text-muted-foreground">{w.key === "GOLD" ? "Safevest Gold holding" : "Available balance"}</small>
                </span>
                <strong className="text-sm">{hidden ? "••••" : w.display}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {actions.map((a) => {
            const Icon = a.icon;
            const content = <>
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4.5" />
              </span>
              <span className="text-[11px] font-semibold leading-tight">{a.label}</span>
            </>;
            return a.to ? (
              <Link key={a.label} to={a.to} className="panel flex min-h-25 flex-col items-center justify-center gap-2 p-3 text-center transition hover:border-primary/40">
                {content}
              </Link>
            ) : (
              <button key={a.label} onClick={() => setFlow({ kind: a.kind, currency })} className="panel flex min-h-25 flex-col items-center justify-center gap-2 p-3 text-center">
                {content}
              </button>
            );
          })}
        </div>
      </section>
      <section className="mt-8 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <Link to="/transactions" className="flex min-h-11 items-center gap-1 text-xs font-semibold text-primary">View all <ArrowRight className="size-4" /></Link>
          </div>
          {transactions.slice(0, 4).map((tx) => <TransactionRow key={tx.id} tx={tx} />)}
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Safevest</h2>
          {safevestProducts.map((p) => (
            <Link key={p.id} to={`/wealth?product=${p.id}`} className="panel grid min-h-24 grid-cols-[auto_1fr_auto] items-center gap-3 p-4">
              <span className="grid size-11 place-items-center rounded-lg bg-secondary text-primary"><Landmark /></span>
              <span>
                <strong className="block text-sm">{p.name}</strong>
                <small className="text-muted-foreground">{p.rate}</small>
              </span>
              <strong>{formatMoney(p.balance, p.currency)}</strong>
            </Link>
          ))}
        </div>
      </section>
      </section>
      <ActionFlow kind={flow?.kind ?? "fund"} presetCurrency={flow?.currency} open={Boolean(flow)} onOpenChange={(v) => !v && setFlow(null)} />
    </>
}
