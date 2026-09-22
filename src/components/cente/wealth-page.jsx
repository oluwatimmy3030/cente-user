import { useEffect, useState } from "react";
import { Gem } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ActionFlow } from "./action-flow";
import { PageTitle, TransactionRow } from "./ui";
import { SafevestUSD, SafevestNGN, SafevestGold } from "./safevest-forms";
import { formatMoney, formatOunces, goldPrice } from "@/data/mock-data";
import { useCente } from "@/state/cente-context";

const tabs = [
  { key: "USD", label: "Safevest USD" },
  { key: "NGN", label: "Safevest NGN" },
  { key: "GOLD", label: "Safevest Gold" },
];

export default function WealthPage() {
  const [params] = useSearchParams();
  const requested = params.get("product");
  const [module, setModule] = useState(["USD", "NGN", "GOLD"].includes(requested) ? requested : "USD");
  const [flow, setFlow] = useState(null);
  const { gold, plans, transactions } = useCente();

  useEffect(() => {
    if (["USD", "NGN", "GOLD"].includes(requested)) setModule(requested);
  }, [requested]);

  const goldUSD = (gold?.ounces ?? 0) * (goldPrice?.USD ?? 0);
  const goldNGN = (gold?.ounces ?? 0) * (goldPrice?.NGN ?? 0);
  const balanceDisplay = module === "USD" ? formatMoney(goldUSD, "USD") : module === "NGN" ? formatMoney(goldNGN, "NGN") : `${formatOunces(gold?.ounces ?? 0)} · ${formatMoney(goldUSD, "USD")}`;

  return (
    <>
      <PageTitle eyebrow="Safevest" title="Savings & Gold" copy="Manage your USD, NGN savings plans and Gold investments." />
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Module</span>
          <select
            className="field"
            value={module}
            onChange={(e) => setModule(e.target.value)}
          >
            {tabs.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-muted-foreground">Balance: {balanceDisplay}</span>
      </div>
      <div className="mt-6">
        {module === "USD" && <SafevestUSD />}
        {module === "NGN" && <SafevestNGN />}
        {module === "GOLD" && <SafevestGold />}
      </div>
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Your Safevest Plans</h2>
        {plans.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {plans.map((p) => (
              <div key={p.id} className="panel p-4">
                <div className="flex justify-between">
                  <strong className="text-sm">{p.name}</strong>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.status === "Active" ? "bg-success/12 text-success" : p.status === "Pending" ? "bg-warning/12 text-warning" : "bg-muted text-muted-foreground"}`}>
                    {p.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Product:</span> <strong>Safevest {p.product}</strong></div>
                  <div><span className="text-muted-foreground">Duration:</span> <strong>{p.duration} months</strong></div>
                  <div><span className="text-muted-foreground">Amount:</span> <strong>{formatMoney(p.amount, p.product === "GOLD" ? "NGN" : p.product)}</strong></div>
                  <div><span className="text-muted-foreground">Maturity:</span> <strong>{formatMoney(p.maturityValue, p.product === "GOLD" ? "NGN" : p.product)}</strong></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Countdown:</span> <strong>{p.countdown}</strong></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="panel flex flex-col items-center gap-3 py-12 text-center">
            <Gem className="size-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No plans yet. Use the module above to create your first Safevest plan.</p>
          </div>
        )}
      </div>
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Recent Wealth Activity</h2>
        {transactions.slice(0, 5).map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </div>
      <ActionFlow kind={flow?.kind ?? "fund"} presetCurrency={flow?.currency} open={Boolean(flow)} onOpenChange={(v) => !v && setFlow(null)} />
    </>
  );
}
