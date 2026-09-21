import { useState } from "react";
import { PageTitle, TransactionRow } from "@/components/cente/ui";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/data/mock-data";
import { useCente } from "@/state/cente-context";

export default function TransactionsPage() {
  const { transactions } = useCente();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const shown = filter === "All" ? transactions : transactions.filter((t) => t.category === filter);
  const categories = ["All", "Money In", "Money Out", "Wealth", "Swaps", "Gold"];
  return (
    <>
      <PageTitle eyebrow="Activity" title="Transactions" copy="Every payment, conversion and wealth movement in one timeline." />
      <div className="flex gap-2 overflow-x-auto pb-4">
        {categories.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? "currency-pill-active" : "currency-pill"}>
            {f}
          </button>
        ))}
      </div>
      <div className="panel p-4 sm:p-6">
        {shown.length ? (
          shown.map((tx) => <TransactionRow key={tx.id} tx={tx} onClick={() => setSelected(tx)} />)
        ) : (
          <div className="py-20 text-center">
            <p className="font-medium">No transactions here</p>
            <p className="mt-1 text-sm text-muted-foreground">Try another filter.</p>
          </div>
        )}
      </div>
      <Sheet open={Boolean(selected)} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent side="bottom" className="mx-auto rounded-t-2xl border-border bg-background sm:bottom-4 sm:max-w-xl sm:rounded-2xl">
          <SheetHeader>
            <SheetTitle>Transaction details</SheetTitle>
            <SheetDescription>{selected?.id.toUpperCase()}</SheetDescription>
          </SheetHeader>
          {selected && (
            <div className="mt-8">
              <p className={`text-center text-3xl font-semibold ${selected.amount > 0 ? "text-success" : ""}`}>
                {selected.amount > 0 ? "+" : "−"}
                {formatMoney(selected.amount, selected.currency)}
              </p>
              <p className="mt-2 text-center text-sm text-muted-foreground">{selected.title}</p>
              <div className="mt-8 divide-y divide-border rounded-lg border border-border">
                {[
                  ["Status", selected.status],
                  ["Date", selected.date],
                  ["Asset", selected.currency],
                  ["Description", selected.subtitle],
                  ...(selected.quantity ? [["Gold quantity", `${selected.quantity}g`], ["Price per gram", formatMoney(selected.pricePerGram ?? 0, "NGN")]] : []),
                  ["Fee", formatMoney(selected.fee ?? 0, selected.currency)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 p-4 text-sm">
                    <span className="text-muted-foreground">{k}</span>
                    <strong className="text-right">{String(v)}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
