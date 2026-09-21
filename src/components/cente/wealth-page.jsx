import { useState } from "react";
import { Gem, Landmark, TrendingUp } from "lucide-react";
import { ActionFlow } from "./action-flow";
import { MiniChart, PageTitle, TransactionRow } from "./ui";
import { Button } from "@/components/ui/button";
import { formatMoney, goldPrice, safevestProducts } from "@/data/mock-data";
import { useCente } from "@/state/cente-context";

export default function WealthPage() {
  const { gold, transactions } = useCente();
  const [active, setActive] = useState("GOLD");
  const [flow, setFlow] = useState(null);
  const product = safevestProducts.find((p) => p.id === active);
  const isGold = active === "GOLD";
  const balance = isGold ? gold.grams * goldPrice.NGN : product?.balance ?? 0;
  const currency = isGold ? "NGN" : active;
  return (
    <>
      <PageTitle eyebrow="Safevest" title="Build lasting wealth" copy="Flexible mock savings in NGN, USD and fully featured digital gold." />
      <div className="flex gap-2 overflow-x-auto pb-4">
        {["USD", "NGN", "GOLD"].map((c) => (
          <button key={c} onClick={() => setActive(c)} className={active === c ? "currency-pill-active" : "currency-pill"}>Safevest {c === "GOLD" ? "Gold" : c}</button>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className={isGold ? "balance-card rounded-xl p-5 sm:p-7" : "panel p-5 sm:p-7"}>
          <div className="flex items-center justify-between">
            <span className={`grid size-12 place-items-center rounded-lg ${isGold ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
              {isGold ? <Gem /> : <Landmark />}
            </span>
            <span className="flex items-center gap-1 text-xs text-success"><TrendingUp className="size-3" /> {isGold ? "+13.9%" : "+4.8%"}</span>
          </div>
          <p className={`mt-8 text-xs ${isGold ? "text-primary-foreground/60" : "text-muted-foreground"}`}>Current value</p>
          <h2 className={`mt-1 font-display text-4xl ${isGold ? "text-primary-foreground" : ""}`}>{formatMoney(balance, currency)}</h2>
          {isGold && <p className="mt-1 text-sm text-primary-foreground/65">{gold.grams.toFixed(3)}g at {formatMoney(goldPrice.NGN)}/g</p>}
          <div className="mt-6"><MiniChart tone={isGold ? "gold" : "green"} /></div>
          <div className="grid grid-cols-3 gap-3 border-t border-border/60 pt-5 text-xs">
            <div><span className="text-muted-foreground">Invested</span><strong className="mt-1 block">{formatMoney(isGold ? gold.invested : product?.contributed ?? 0, currency)}</strong></div>
            <div><span className="text-muted-foreground">Gain</span><strong className="mt-1 block text-success">{formatMoney(isGold ? gold.invested * 0.139 : product?.gain ?? 0, currency)}</strong></div>
            <div><span className="text-muted-foreground">Rate</span><strong className="mt-1 block">{isGold ? "Mock" : product?.rate}</strong></div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setFlow({ kind: "save", currency })}>Add funds</Button>
            <Button variant="outline" onClick={() => setFlow({ kind: "withdraw", currency })}>Withdraw</Button>
          </div>
          {isGold && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setFlow({ kind: "gold-buy", currency: "NGN" })}>Buy gold</Button>
              <Button variant="outline" onClick={() => setFlow({ kind: "gold-sell", currency: "NGN" })}>Redeem gold</Button>
            </div>
          )}
        </div>
        <div className="panel p-5">
          <h2 className="mb-2 text-lg font-semibold">Wealth activity</h2>
          {transactions.slice(0, 5).map((tx) => <TransactionRow key={tx.id} tx={tx} />)}
        </div>
      </div>
      <ActionFlow kind={flow?.kind ?? "save"} presetCurrency={flow?.currency} open={Boolean(flow)} onOpenChange={(v) => !v && setFlow(null)} />
    </>
  );
}
