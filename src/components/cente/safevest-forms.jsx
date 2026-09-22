import { useMemo, useState } from "react";
import { ChevronLeft, Landmark, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney, formatOunces, goldPrice, rates } from "@/data/mock-data";
import { useCente } from "@/state/cente-context";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const usdTerms = [
  { months: 1, label: "1 month", apr: "4% APR" },
  { months: 3, label: "3 months", apr: "5% APR" },
  { months: 6, label: "6 months", apr: "6% APR" },
  { months: 9, label: "9 months", apr: "7.5% APR" },
  { months: 12, label: "1 year", apr: "9% APR" },
];

const ngnTerms = [
  { months: 0.23, label: "7 days", apr: "8% APR" },
  { months: 1, label: "1 month", apr: "10% APR" },
  { months: 3, label: "3 months", apr: "12% APR" },
  { months: 6, label: "6 months", apr: "14% APR" },
  { months: 9, label: "9 months", apr: "16% APR" },
  { months: 12, label: "1 year", apr: "20% APR" },
];

function computeDates(termMonths) {
  const now = new Date("2026-09-22T12:00:00Z");
  const end = new Date(now);
  end.setMonth(end.getMonth() + termMonths);
  const diffDays = Math.round((end - now) / 86400000);
  return {
    countdown: `${diffDays} days`,
    start: `${now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} 00:00 UTC`,
    maturity: `${end.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} 00:00 UTC`,
  };
}

function Flag({ currency }) {
  if (currency === "USD") return <span className="text-base">🇺🇸</span>;
  if (currency === "NGN") return <span className="text-base">🇳🇬</span>;
  return null;
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <select className="field" value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {options.map((o) => (
          <option key={o.months} value={o.months}>
            {o.label} — ({o.apr})
          </option>
        ))}
      </select>
    </div>
  );
}

export function SafevestUSD() {
  const { createPlan } = useCente();
  const [amount, setAmount] = useState("5,000");
  const [term, setTerm] = useState(6);
  const [planOpen, setPlanOpen] = useState(false);
  const numeric = Number(String(amount).replace(/,/g, "")) || 0;
  const termData = usdTerms.find((t) => t.months === term) ?? usdTerms[2];
  const dates = useMemo(() => computeDates(termData.months), [termData.months]);
  const rate = 0.06;
  const expectedReturn = numeric * rate * (termData.months / 12);

  const submit = () => {
    if (numeric <= 0) return;
    const end = new Date("2026-09-22T12:00:00Z");
    end.setMonth(end.getMonth() + termData.months);
    createPlan({
      product: "USD",
      name: "USD savings plan",
      amount: numeric,
      frequency: "One-time",
      duration: termData.months,
      expectedReturn,
      maturityValue: numeric + expectedReturn,
      startDate: "2026-09-22",
      endDate: end.toISOString().slice(0, 10),
      countdown: dates.countdown,
      lock: "Safe Lock",
      status: "Pending",
    });
    setPlanOpen(true);
  };

  return (
    <div className="mx-auto max-w-[600px]">
      <button className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground">
        <ChevronLeft className="size-4" /> Back
      </button>
      <div className="mt-3">
        <h1 className="font-display text-3xl font-semibold">Safevest USD</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a currency to start saving. You can fund with your local currency or Stablecoins.
        </p>
      </div>
      <div className="mt-6 space-y-5">
        <div>
          <label className="form-label">Safevest USD Plan</label>
          <select className="field" defaultValue="Safevest USD">
            <option>Safevest USD</option>
          </select>
        </div>
        <div>
          <label className="form-label">Savings Amount</label>
          <div className="amount-field">
            <div className="flex items-center gap-1.5">
              <Flag currency="USD" />
              <span className="text-sm font-bold">USD</span>
            </div>
            <Input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="5,000"
            />
          </div>
        </div>
        <FormSelect label="Savings Term" value={term} onChange={setTerm} options={usdTerms} />
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Term countdown: {dates.countdown}</p>
          <p className="text-xs text-muted-foreground">
            Term starts: {dates.start} · Matures: {dates.maturity}
          </p>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-xl border border-border bg-[#FFFDF5] p-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Returns</p>
            <div className="mt-1 flex items-center gap-2">
              <strong className="font-display text-2xl">{formatMoney(expectedReturn, "USD")}</strong>
              <span className="rounded-full bg-success/12 px-2 py-0.5 text-xs font-semibold text-success">
                +{((rate * 100 * (termData.months / 12)).toFixed(1))}%
              </span>
            </div>
          </div>
          <Button size="lg" className="bg-[#3E2723] text-white hover:bg-[#4E342E]" onClick={submit}>
            Pay Now
          </Button>
        </div>
      </div>
      <Sheet open={planOpen} onOpenChange={setPlanOpen}>
        <SheetContent side="bottom" className="mx-auto max-h-[60vh] overflow-y-auto rounded-t-2xl bg-background sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Plan Created</SheetTitle>
            <SheetDescription>Your Safevest USD plan has been set up.</SheetDescription>
          </SheetHeader>
          <div className="grid min-h-[200px] place-items-center px-5 pb-8 pt-6 text-center">
            <div>
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/12 text-success">
                <Landmark className="size-8" />
              </div>
              <h3 className="mt-5 font-display text-3xl">Plan created</h3>
              <p className="mt-2 text-sm text-muted-foreground">Your Safevest USD plan is pending and ready to review.</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function SafevestNGN() {
  const { createPlan } = useCente();
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState(6);
  const [planOpen, setPlanOpen] = useState(false);
  const numeric = Number(String(amount).replace(/,/g, "")) || 0;
  const termData = ngnTerms.find((t) => t.months === term) ?? ngnTerms[3];
  const dates = useMemo(() => computeDates(termData.months), [termData.months]);
  const rateMap = { 0.23: 0.08, 1: 0.10, 3: 0.12, 6: 0.14, 9: 0.16, 12: 0.20 };
  const rate = rateMap[termData.months] ?? 0.14;
  const expectedReturn = numeric * rate * (termData.months / 12);

  const submit = () => {
    if (numeric <= 0) return;
    const end = new Date("2026-09-22T12:00:00Z");
    end.setMonth(end.getMonth() + termData.months);
    createPlan({
      product: "NGN",
      name: "NGN savings plan",
      amount: numeric,
      frequency: "One-time",
      duration: termData.months,
      expectedReturn,
      maturityValue: numeric + expectedReturn,
      startDate: "2026-09-22",
      endDate: end.toISOString().slice(0, 10),
      countdown: dates.countdown,
      lock: "Safe Lock",
      status: "Pending",
    });
    setPlanOpen(true);
  };

  return (
    <div className="mx-auto max-w-[600px]">
      <button className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground">
        <ChevronLeft className="size-4" /> Back
      </button>
      <div className="mt-3">
        <h1 className="font-display text-3xl font-semibold">Safevest NGN</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a currency to start saving. You can fund with your local currency or Stablecoins.
        </p>
      </div>
      <div className="mt-6 space-y-5">
        <div>
          <label className="form-label">Safevest NGN Plan</label>
          <select className="field" defaultValue="Safevest NGN">
            <option>Safevest NGN</option>
          </select>
        </div>
        <div>
          <label className="form-label">Savings Amount</label>
          <div className="amount-field">
            <div className="flex items-center gap-1.5">
              <Flag currency="NGN" />
              <span className="text-sm font-bold">NGN</span>
            </div>
            <Input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="500,000"
            />
          </div>
        </div>
        <FormSelect label="Savings Term" value={term} onChange={setTerm} options={ngnTerms} />
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Term countdown: {dates.countdown}</p>
          <p className="text-xs text-muted-foreground">
            Term starts: {dates.start} · Matures: {dates.maturity}
          </p>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-xl border border-border bg-[#FFFDF5] p-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Returns</p>
            <div className="mt-1 flex items-center gap-2">
              <strong className="font-display text-2xl">₦{expectedReturn.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              <span className="rounded-full bg-success/12 px-2 py-0.5 text-xs font-semibold text-success">
                +{((rate * 100 * (termData.months / 12)).toFixed(1))}%
              </span>
            </div>
          </div>
          <Button size="lg" className="bg-[#3E2723] text-white hover:bg-[#4E342E]" onClick={submit}>
            Pay Now
          </Button>
        </div>
      </div>
      <Sheet open={planOpen} onOpenChange={setPlanOpen}>
        <SheetContent side="bottom" className="mx-auto max-h-[60vh] overflow-y-auto rounded-t-2xl bg-background sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Plan Created</SheetTitle>
            <SheetDescription>Your Safevest NGN plan has been set up.</SheetDescription>
          </SheetHeader>
          <div className="grid min-h-[200px] place-items-center px-5 pb-8 pt-6 text-center">
            <div>
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/12 text-success">
                <Landmark className="size-8" />
              </div>
              <h3 className="mt-5 font-display text-3xl">Plan created</h3>
              <p className="mt-2 text-sm text-muted-foreground">Your Safevest NGN plan is pending and ready to review.</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function SafevestGold() {
  const { gold, plans, createPlan } = useCente();
  const [view, setView] = useState("overview");
  const [tab, setTab] = useState("Active Plan");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [planType, setPlanType] = useState("Flex Save (Withdraw Anytime)");
  const [created, setCreated] = useState(false);

  const numeric = Number(String(amount).replace(/,/g, "")) || 0;
  const weight = numeric / (currency === "USD" ? goldPrice.USD : goldPrice.NGN);
  const rateDisplay = currency === "USD" ? `$${goldPrice.USD.toLocaleString()}` : `₦${goldPrice.NGN.toLocaleString()}`;

  const tabs = ["Active Plan", "Pending", "Completed Plan"];
  const filteredPlans = plans.filter((p) => p.product === "GOLD" && p.status.toLowerCase().includes(tab === "Active Plan" ? "active" : tab === "Pending" ? "pending" : "completed"));

  const submit = () => {
    if (numeric <= 0) return;
    const ounces = numeric / (currency === "USD" ? goldPrice.USD : goldPrice.NGN);
    createPlan({
      product: "GOLD",
      name: `${planType} Gold Plan`,
      amount: numeric,
      ounces,
      frequency: "One-time",
      duration: 12,
      expectedReturn: numeric * 0.08,
      maturityValue: numeric * 1.08,
      startDate: "2026-09-22",
      endDate: "2027-09-22",
      countdown: "365 days",
      lock: planType.includes("Safe") ? "Safe Lock" : "Withdraw Anytime",
      status: "Pending",
    });
    setCreated(true);
  };

  return (
    <div className="mx-auto max-w-[600px]">
      {view === "overview" ? (
        <>
          <button className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground" onClick={() => setView("overview")}>
            <ChevronLeft className="size-4" /> Back
          </button>
          <div className="mt-3">
            <h1 className="font-display text-3xl font-semibold">Safevest Gold</h1>
            <p className="mt-1 text-sm text-muted-foreground">Choose a currency to start saving. You can fund with your local currency or Stablecoins.</p>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Total Balance", value: formatMoney(gold.ounces * (currency === "USD" ? goldPrice.USD : goldPrice.NGN), currency) },
              { label: "Gold Weight", value: formatOunces(gold.ounces) },
              { label: "Active Plans", value: String(plans.filter((p) => p.product === "GOLD" && p.status === "Active").length) },
            ].map((s) => (
              <div key={s.label} className="panel p-4 text-center">
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <p className="mt-1 font-display text-xl font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-2">
              {tabs.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${tab === t ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-accent"}`}>
                  {t}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={() => setView("create")}>Create New Plan</Button>
          </div>
          <div className="mt-5">
            {filteredPlans.length > 0 ? (
              <div className="space-y-3">
                {filteredPlans.map((p) => (
                  <div key={p.id} className="panel p-4">
                    <div className="flex justify-between">
                      <div>
                        <strong className="text-sm">{p.name}</strong>
                        <p className="text-xs text-muted-foreground">{p.duration} months · {p.lock}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${p.status === "Active" ? "bg-success/12 text-success" : p.status === "Pending" ? "bg-warning/12 text-warning" : "bg-muted text-muted-foreground"}`}>{p.status}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-muted-foreground">Amount:</span> <strong>{formatMoney(p.amount, "NGN")}</strong></div>
                      <div><span className="text-muted-foreground">Maturity:</span> <strong>{formatMoney(p.maturityValue, "NGN")}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="panel flex flex-col items-center gap-3 py-12 text-center">
                <Gem className="size-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">You don&apos;t have an active Safevest plan yet. Start by choosing an amount, currency and duration.</p>
                <Button size="sm" onClick={() => setView("create")}>Create New Plan</Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <button className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground" onClick={() => setView("overview")}>
            <ChevronLeft className="size-4" /> Back
          </button>
          <div className="mt-3">
            <h1 className="font-display text-3xl font-semibold">Create your first Safevest Gold Plan</h1>
            <p className="mt-1 text-sm text-muted-foreground">You don&apos;t have an active Safevest plan yet. Start by choosing an amount, currency and duration.</p>
          </div>
          <div className="mt-6 space-y-5">
            <div>
              <label className="form-label">Gold Amount</label>
              <div className="amount-field">
                <div className="flex items-center gap-1.5">
                  <span className="grid size-6 place-items-center rounded bg-secondary">
                    <Gem className="size-3.5 text-primary" />
                  </span>
                  <span className="text-sm font-bold">{currency}</span>
                </div>
                <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="5,000" />
              </div>
            </div>
            <div>
              <label className="form-label">Weight</label>
              <div className="amount-field">
                <span className="text-sm font-bold">OZ</span>
                <Input readOnly value={weight > 0 ? weight.toFixed(4) : "0.0000"} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Rate - 1oz Gold = {rateDisplay}</p>
            <div>
              <label className="form-label">Plan</label>
              <select className="field" value={planType} onChange={(e) => setPlanType(e.target.value)}>
                <option>Flex Save (Withdraw Anytime)</option>
                <option>Safe Lock (locked plan)</option>
              </select>
            </div>
            <Button className="w-full bg-[#3E2723] text-white hover:bg-[#4E342E]" size="lg" onClick={() => { submit(); setCreated(true); }}>BUY GOLD</Button>
          </div>
          <Sheet open={created} onOpenChange={setCreated}>
            <SheetContent side="bottom" className="mx-auto max-h-[50vh] overflow-y-auto rounded-t-2xl bg-background sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Gold Purchase Complete</SheetTitle>
              </SheetHeader>
              <div className="grid min-h-[200px] place-items-center px-5 pb-8 pt-6 text-center">
                <div>
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/12 text-success"><Gem className="size-8" /></div>
                  <h3 className="mt-5 font-display text-3xl">Gold purchased</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Your gold has been added to your Safevest Gold holding.</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
}
