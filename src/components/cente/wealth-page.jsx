// src/components/cente/wealth-page.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Gem,
  Coins,
  TrendingUp,
  Wallet,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  CircleDashed,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ActionFlow } from "./action-flow";
import { PageTitle } from "./ui";
import { SafevestUSD, SafevestNGN, SafevestGold } from "./safevest-forms";
import { formatMoney, formatOunces, goldPrice } from "@/data/mock-data";
import { useCente } from "@/state/cente-context";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const TABS = [
  {
    key: "USD",
    label: "Safevest USD",
    shortLabel: "USD",
    icon: Wallet,
    accent: "from-sky-500/15 to-sky-500/0",
    ring: "ring-sky-500/30",
  },
  {
    key: "NGN",
    label: "Safevest NGN",
    shortLabel: "NGN",
    icon: Coins,
    accent: "from-emerald-500/15 to-emerald-500/0",
    ring: "ring-emerald-500/30",
  },
  {
    key: "GOLD",
    label: "Safevest Gold",
    shortLabel: "Gold",
    icon: Gem,
    accent: "from-amber-500/15 to-amber-500/0",
    ring: "ring-amber-500/30",
  },
];

const VALID_KEYS = TABS.map((t) => t.key);
const isValidTab = (v) => typeof v === "string" && VALID_KEYS.includes(v);

// Full plan status info — kept short & non-wrapping
const STATUS_META = {
  Active: {
    label: "Active",
    Icon: CheckCircle2,
    cls: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
  },
  Pending: {
    label: "Pending",
    Icon: Clock,
    cls: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  },
  Completed: {
    label: "Done",
    Icon: CheckCircle2,
    cls: "bg-sky-500/12 text-sky-600 dark:text-sky-400",
  },
  Failed: {
    label: "Failed",
    Icon: CircleDashed,
    cls: "bg-rose-500/12 text-rose-600 dark:text-rose-400",
  },
  Cancelled: {
    label: "Cancelled",
    Icon: CircleDashed,
    cls: "bg-muted text-muted-foreground",
  },
};

function normalizeStatus(s) {
  if (!s) return STATUS_META.Cancelled;
  const key = String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+plan$/, "");
  const map = {
    active: STATUS_META.Active,
    pending: STATUS_META.Pending,
    completed: STATUS_META.Completed,
    failed: STATUS_META.Failed,
    cancelled: STATUS_META.Cancelled,
  };
  return map[key] ?? STATUS_META.Cancelled;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function WealthPage() {
  const [params] = useSearchParams();
  const requested = params.get("product");
  const [module, setModule] = useState(isValidTab(requested) ? requested : "USD");
  const [flow, setFlow] = useState(null);
  const { gold, plans, transactions } = useCente();

  useEffect(() => {
    if (isValidTab(requested)) setModule(requested);
  }, [requested]);

  const goldUSD = (gold?.ounces ?? 0) * (goldPrice?.USD ?? 0);
  const goldNGN = (gold?.ounces ?? 0) * (goldPrice?.NGN ?? 0);

  const balanceDisplay = useMemo(() => {
    if (module === "USD") return formatMoney(goldUSD, "USD");
    if (module === "NGN") return formatMoney(goldNGN, "NGN");
    return `${formatOunces(gold?.ounces ?? 0)} · ${formatMoney(goldUSD, "USD")}`;
  }, [module, goldUSD, goldNGN, gold?.ounces]);

  const activeTab = TABS.find((t) => t.key === module) ?? TABS[0];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-20 sm:space-y-8 [contain:layout]">
      <PageTitle
        eyebrow="Safevest"
        title="Savings & Gold"
        copy="Manage your USD, NGN savings plans and Gold investments."
      />

      {/* ---------------------------------------------------------------- */}
      {/*  Tabs + balance                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="rounded-2xl border border-border/70 bg-card p-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs — fixed height, no scroll, no wrap */}
          <div
            role="tablist"
            aria-label="Safevest module"
            className="grid h-11 w-full grid-cols-3 gap-1 rounded-xl bg-muted/50 p-1 sm:w-auto sm:grid-cols-none sm:grid-flow-col"
          >
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = module === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setModule(t.key)}
                  className={[
                    "inline-flex h-9 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-sm font-medium leading-none transition-colors sm:gap-2 sm:px-3",
                    active
                      ? "bg-background text-foreground shadow-sm ring-1 " + t.ring
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon
                    className={`size-4 shrink-0 ${active ? "" : "opacity-70"}`}
                  />
                  <span className="truncate sm:hidden">{t.shortLabel}</span>
                  <span className="hidden truncate sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Balance chip */}
          <div
            className={`flex h-11 w-full items-center gap-3 rounded-xl border border-border/70 bg-gradient-to-br ${activeTab.accent} px-3.5 sm:w-auto`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background/70 ring-1 ring-border/60">
              <Sparkles className="size-4 text-foreground/80" />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {activeTab.shortLabel} balance
              </p>
              <p className="truncate text-sm font-bold text-foreground">
                {balanceDisplay}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Module form                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
        <header className="flex items-center justify-between gap-2 border-b border-border/60 bg-muted/30 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div
              className={`flex size-7 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ${activeTab.ring}`}
            >
              <Plus className="size-3.5 text-foreground/80" />
            </div>
            <div className="min-w-0 leading-tight">
              <h2 className="truncate whitespace-nowrap text-sm font-semibold">
                New plan
              </h2>
              <p className="truncate text-[11px] text-muted-foreground">
                Fill in the fields — everything here is editable.
              </p>
            </div>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-background px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-border/60">
            {activeTab.shortLabel}
          </span>
        </header>

        <div className="p-4 sm:p-6">
          {module === "USD" && <SafevestUSD />}
          {module === "NGN" && <SafevestNGN />}
          {module === "GOLD" && <SafevestGold />}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Plans                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight">
              Your Safevest Plans
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {plans.length > 0
                ? `${plans.length} active plan${plans.length > 1 ? "s" : ""}`
                : "No plans yet"}
            </p>
          </div>
          <TrendingUp className="size-4 shrink-0 text-muted-foreground/60" />
        </div>

        {plans.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        ) : (
          <EmptyPlans />
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Recent activity                                                  */}
      {/* ---------------------------------------------------------------- */}
      <ActivityList transactions={transactions} />

      <ActionFlow
        kind={flow?.kind ?? "fund"}
        presetCurrency={flow?.currency}
        open={Boolean(flow)}
        onOpenChange={(v) => !v && setFlow(null)}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const { label, Icon, cls } = normalizeStatus(status);
  return (
    <span
      title={String(status ?? "")}
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${cls}`}
    >
      <Icon className="size-3" />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}

function PlanCard({ plan }) {
  const currency = plan.product === "GOLD" ? "NGN" : plan.product;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight">
            {plan.name}
          </p>
          <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Safevest {plan.product}
          </p>
        </div>
        <StatusBadge status={plan.status} />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
        <Detail label="Duration" value={`${plan.duration} mo`} />
        <Detail label="Amount" value={formatMoney(plan.amount, currency)} />
        <Detail
          label="Maturity"
          value={formatMoney(plan.maturityValue, currency)}
        />
        <Detail label="Countdown" value={plan.countdown} />
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="truncate font-semibold text-foreground">{value}</p>
    </div>
  );
}

function EmptyPlans() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/20 px-4 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-background ring-1 ring-border/60">
        <Gem className="size-5 text-muted-foreground/50" />
      </div>
      <div>
        <p className="text-sm font-medium">No plans yet</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Use the module above to create your first Safevest plan.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Activity                                                                  */
/* -------------------------------------------------------------------------- */

function ActivityList({ transactions }) {
  const items = (transactions ?? []).slice(0, 5);

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold tracking-tight">
            Recent Wealth Activity
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            Your latest {items.length} transaction
            {items.length === 1 ? "" : "s"} across all Safevest products
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        {items.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {items.map((tx) => (
              <ActivityItem key={tx.id} tx={tx} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ActivityItem({ tx }) {
  const title = tx.title ?? tx.description ?? tx.type ?? "Transaction";

  const subtitleParts = [];
  if (tx.date) subtitleParts.push(tx.date);
  else if (tx.createdAt) subtitleParts.push(tx.createdAt);
  if (tx.status) subtitleParts.push(tx.status);
  if (tx.product) subtitleParts.push(tx.product);
  const subtitle = subtitleParts.join(" · ");

  const amountLabel =
    tx.amount != null && tx.currency
      ? formatMoney(tx.amount, tx.currency)
      : tx.amountLabel ?? "";

  const positive = tx.direction === "in" || tx.amount > 0;

  return (
    <li className="px-4 py-3.5 transition-colors hover:bg-muted/30 sm:px-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted ring-1 ring-border/60">
            <TrendingUp className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {title}
            </p>
            {subtitle && (
              <p className="truncate text-[11px] text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {amountLabel && (
          <div className="ml-auto shrink-0 text-right">
            <p
              className={[
                "text-sm font-semibold tabular-nums",
                positive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-foreground",
              ].join(" ")}
            >
              {amountLabel}
            </p>
          </div>
        )}
      </div>
    </li>
  );
}