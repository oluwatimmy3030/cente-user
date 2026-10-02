// src/components/cente/wallet-page.jsx
import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  Gem,
  Send,
  Wallet,
  Landmark,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ActionFlow } from "./action-flow";
import { AssetIcon, PageTitle, TransactionRow } from "./ui";
import { Button } from "@/components/ui/button";
import {
  formatMoney,
  formatOunces,
  goldPrice,
  rates,
  user,
} from "@/data/mock-data";
import { useCente } from "@/state/cente-context";

/* -------------------------------------------------------------------------- */
/*  Spiral background                                                         */
/* -------------------------------------------------------------------------- */

const GOLD = "#96691a";

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

const SPIRAL_WIDE = buildSpiral({ cx: 330, cy: 70, turns: 9, gap: 16 });
const SPIRAL_TALL = buildSpiral({ cx: 190, cy: 40, turns: 9, gap: 16 });

function SpiralBackground({ path, viewBox, align }) {
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio={align}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <path
        d={path}
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

export default function WalletPage() {
  const { balances, gold, transactions } = useCente();
  const [flow, setFlow] = useState(null);

  const total = balances.NGN + balances.USD * rates.NGN_USD;

  const currencies = ["USD", "NGN"];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-20 sm:space-y-8 [contain:layout]">
      <PageTitle
        eyebrow="Accounts"
        title="Your Accounts"
        copy="USD and NGN wallets, account details, and your Safevest Gold holding."
      />

      {/* ---------------------------------------------------------------- */}
      {/*  Total balance card                                               */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="relative overflow-hidden rounded-3xl p-5 text-white sm:p-7"
        style={{ backgroundColor: GOLD }}
      >
        <SpiralBackground
          path={SPIRAL_WIDE}
          viewBox="0 0 400 260"
          align="xMaxYMid slice"
        />

        <div className="relative z-10">
          <p className="text-sm text-white/85">Total wallet balance</p>
          <h2 className="mt-2 truncate font-display text-3xl font-semibold tabular-nums sm:text-4xl">
            {formatMoney(total)}
          </h2>
          <p className="mt-3 flex items-center gap-2 text-xs text-white/80">
            <Wallet className="size-3.5 shrink-0" />
            <span className="truncate">
              Wallet ID {user.walletId}. Mock USD conversion.
            </span>
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Quick actions: Fund / Send / Swap                               */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2">
        {currencies.map((c) => {
          const balance = balances[c] ?? 0;
          return (
            <div key={c} className="panel overflow-hidden p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <AssetIcon currency={c} />
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {c} Wallet
                </span>
              </div>

              <p className="mt-5 truncate text-2xl font-semibold tabular-nums sm:mt-6">
                {formatMoney(balance, c)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Available balance. Demo.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFlow({ kind: "fund", currency: c })}
                  className="min-w-0"
                >
                  <ArrowDownToLine className="size-4 shrink-0" />
                  <span className="truncate">Fund</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFlow({ kind: "swap", currency: c })}
                  className="min-w-0"
                >
                  <ArrowLeftRight className="size-4 shrink-0" />
                  <span className="truncate">Swap</span>
                </Button>
                <Button asChild variant="outline" size="sm" className="min-w-0">
                  <Link to="/send">
                    <Send className="size-4 shrink-0" />
                    <span className="truncate">Send</span>
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Gold + Activity                                                  */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid gap-5 xl:grid-cols-[.7fr_1.3fr]">
        {/* Gold card — full tile link */}
        <Link
          to="/wealth?product=GOLD"
          className="relative flex min-h-56 flex-col overflow-hidden rounded-3xl p-5 text-white transition-transform hover:-translate-y-0.5 sm:p-6"
          style={{ backgroundColor: GOLD }}
        >
          <SpiralBackground
            path={SPIRAL_TALL}
            viewBox="0 0 320 260"
            align="xMidYMin slice"
          />

          <div className="relative z-10 flex flex-1 flex-col">
            <span className="grid size-9 place-items-center rounded-full bg-white/15">
              <Gem className="size-4" />
            </span>

            <div className="mt-auto pt-6">
              <p className="text-sm text-white/85">Safevest Gold</p>
              <h2 className="mt-1 truncate font-display text-2xl font-semibold tabular-nums sm:text-3xl">
                {formatOunces(gold.ounces)}
              </h2>
              <p className="mt-1 truncate text-sm text-white/80">
                {formatMoney(gold.ounces * goldPrice.NGN)} mock value
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-white">
                <span>View in Wealth</span>
                <TrendingUp className="size-3.5 shrink-0" />
              </div>
            </div>
          </div>
        </Link>

        {/* Activity list */}
        <div className="panel overflow-hidden p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="truncate text-base font-semibold sm:text-lg">
              Account activity
            </h2>
            <Landmark className="size-4 shrink-0 text-muted-foreground/60" />
          </div>

          {transactions.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No activity yet
            </p>
          ) : (
            <div className="-mx-1">
              {transactions.slice(0, 5).map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </div>
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