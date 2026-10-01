// src/components/cente/send-page.jsx
import { useState } from "react";
import { Check, ChevronLeft, LoaderCircle, Send, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTitle } from "./ui";
import { formatMoney, rates } from "@/data/mock-data";
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

export default function SendPage() {
  const { user, balances, completeAction, verified, verify, verifyPhoneOtp, pinSet, setupPin } = useCente();
  const [step, setStep] = useState("details");
  const [source, setSource] = useState("NGN");
  const [destination, setDestination] = useState("NGN");
  const [method, setMethod] = useState("NGN Local Bank Transfer");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState({ name: "", bank: "", account: "", routing: "", address: "" });
  const [otp, setOtp] = useState("");
  const [idType, setIdType] = useState("BVN");
  const [idNumber, setIdNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const numeric = Number(amount) || 0;
  const isNigerian = user?.countryCode === "+234" || user?.country === "Nigeria";
  const methods = destination === "USD"
    ? ["USD Local (ACH)", "International Wire / SWIFT"]
    : ["NGN Local Bank Transfer"];

  const received = source === destination
    ? numeric
    : source === "NGN"
      ? (numeric / rates.NGN_USD) * 0.995
      : numeric * rates.NGN_USD * 0.995;

  const setField = (key, value) => setRecipient((r) => ({ ...r, [key]: value }));

  const next = () => {
    setError("");
    if (numeric <= 0) return setError("Enter an amount greater than zero.");
    if (numeric > (balances[source] ?? 0)) return setError("Your available balance is too low.");
    if (!recipient.name || !recipient.bank || !recipient.account) return setError("Complete the recipient details.");

    // Step 1: Phone OTP check
    if (!user?.phoneVerified) {
      return setStep("otp");
    }

    // Step 2: KYC check
    if (!verified && isNigerian) {
      return setStep("kyc");
    }

    setStep("review");
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) return setError("Enter the 6-digit SMS OTP code.");
    verifyPhoneOtp();
    setError("");
    if (!verified && isNigerian) {
      setStep("kyc");
    } else {
      setStep("review");
    }
  };

  const handleVerifyKyc = () => {
    if (idNumber.length !== 11) return setError(`Enter an 11-digit ${idType}.`);
    setStep("kyc_loading");
    setTimeout(() => {
      verify();
      setStep("review");
    }, 900);
  };

  const submit = () => {
    if (pin.length !== 4) return setError("Enter your 4-digit security PIN.");
    if (!pinSet) setupPin(pin);

    completeAction({
      type: "send",
      amount: numeric,
      currency: source,
      recipient: recipient.name,
      payoutMethod: method,
    });
    setStep("success");
  };

  const reset = () => {
    setStep("details");
    setAmount("");
    setPin("");
    setOtp("");
    setError("");
    setRecipient({ name: "", bank: "", account: "", routing: "", address: "" });
  };

  return (
    <>
      <PageTitle
        eyebrow="Payments"
        title="Send Money"
        copy="Send funds instantly from your NGN or USD balance with bank-grade security."
      />

      <div className="mx-auto max-w-3xl space-y-5">
        {/* ------------------------------------------------------------ */}
        {/*  Summary card                                                 */}
        {/* ------------------------------------------------------------ */}
        {step !== "success" && (
          <div
            className="relative overflow-hidden rounded-3xl p-5 text-white sm:p-7"
            style={{ backgroundColor: GOLD }}
          >
            <SpiralBackground />

            <div className="relative z-10">
              <p className="text-sm text-white/85">{source} wallet, available</p>
              <p className="mt-2 truncate font-display text-3xl font-semibold tabular-nums sm:text-4xl">
                {formatMoney(balances[source] ?? 0, source)}
              </p>
              <p className="mt-3 truncate text-xs text-white/80">
                {numeric > 0
                  ? `Recipient receives ${formatMoney(received, destination)}`
                  : "Transfers are free"}
              </p>
            </div>
          </div>
        )}

        <div className="panel p-5 sm:p-7">
          {step !== "details" && step !== "success" && (
            <Button variant="ghost" onClick={() => setStep("details")} className="mb-4">
              <ChevronLeft /> Back
            </Button>
          )}

          {/* DETAILS STEP */}
          {step === "details" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">Source Wallet</label>
                  <select className="field" value={source} onChange={(e) => setSource(e.target.value)}>
                    <option value="NGN">NGN Wallet</option>
                    <option value="USD">USD Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Destination Currency</label>
                  <select
                    className="field"
                    value={destination}
                    onChange={(e) => {
                      const v = e.target.value;
                      setDestination(v);
                      setMethod(v === "USD" ? "USD Local (ACH)" : "NGN Local Bank Transfer");
                    }}
                  >
                    <option value="NGN">NGN (Naira)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Payout Channel</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {methods.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={method === m ? "choice-active" : "choice"}
                      onClick={() => setMethod(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Amount</label>
                <div className="amount-field">
                  <span>{source === "USD" ? "$" : "₦"}</span>
                  <Input
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="0.00"
                  />
                </div>
                {source !== destination && numeric > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Live FX rate applied. Estimated recipient amount shown above.
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <h2 className="font-semibold">Recipient Details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input
                    placeholder="Recipient full name"
                    value={recipient.name}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                  <Input
                    placeholder={destination === "NGN" ? "Bank name (e.g. GTBank, Access)" : "Bank name"}
                    value={recipient.bank}
                    onChange={(e) => setField("bank", e.target.value)}
                  />
                  <Input
                    placeholder={destination === "NGN" ? "10-digit NUBAN account number" : "Account number"}
                    value={recipient.account}
                    onChange={(e) => setField("account", e.target.value)}
                  />
                  {destination === "USD" && (
                    <Input
                      placeholder={method.includes("SWIFT") ? "SWIFT / BIC code" : "Routing number"}
                      value={recipient.routing}
                      onChange={(e) => setField("routing", e.target.value)}
                    />
                  )}
                  {destination === "USD" && method.includes("SWIFT") && (
                    <Input
                      className="sm:col-span-2"
                      placeholder="Recipient bank address"
                      value={recipient.address}
                      onChange={(e) => setField("address", e.target.value)}
                    />
                  )}
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button size="lg" className="w-full" onClick={next}>
                Review Transfer
              </Button>
            </div>
          )}

          {/* PHONE OTP STEP */}
          {step === "otp" && (
            <div className="space-y-5 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                <Smartphone className="size-7" />
              </span>
              <div>
                <h3 className="text-xl font-semibold">Verify Phone via Privy SMS OTP</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter the 6-digit code sent to {user?.countryCode} {user?.phone} to authorize transfers.
                </p>
              </div>
              <div className="mx-auto max-w-xs">
                <Input
                  className="h-12 text-center font-mono text-lg tracking-widest"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button size="lg" className="w-full" onClick={handleVerifyOtp}>
                Verify SMS Code
              </Button>
              <button
                type="button"
                onClick={() => setOtp("123456")}
                className="text-xs text-muted-foreground underline"
              >
                Auto-fill demo code (123456)
              </button>
            </div>
          )}

          {/* QOREID KYC STEP */}
          {step === "kyc" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="size-6" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">QoreID Compliance Verification</h3>
                  <p className="text-xs text-muted-foreground">
                    Verify your Nigerian identity before your first bank transfer.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={idType === "BVN" ? "default" : "outline"}
                  onClick={() => { setIdType("BVN"); setIdNumber(""); }}
                >
                  Bank Verification (BVN)
                </Button>
                <Button
                  type="button"
                  variant={idType === "NIN" ? "default" : "outline"}
                  onClick={() => { setIdType("NIN"); setIdNumber(""); }}
                >
                  National ID (NIN)
                </Button>
              </div>

              <Input
                inputMode="numeric"
                maxLength={11}
                placeholder={`Enter 11-digit ${idType}`}
                value={idNumber}
                onChange={(e) => { setIdNumber(e.target.value.replace(/\D/g, "")); setError(""); }}
              />

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button size="lg" className="w-full" onClick={handleVerifyKyc}>
                Verify with QoreID & Continue
              </Button>
            </div>
          )}

          {step === "kyc_loading" && (
            <div className="grid min-h-60 place-items-center text-center">
              <div>
                <LoaderCircle className="mx-auto size-10 animate-spin text-primary" />
                <h4 className="mt-4 font-semibold">Verifying with QoreID…</h4>
                <p className="mt-1 text-xs text-muted-foreground">Connecting to national registry</p>
              </div>
            </div>
          )}

          {/* REVIEW STEP */}
          {step === "review" && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl">Review Transfer</h2>
              <div className="divide-y divide-border rounded-xl border bg-card">
                {[
                  ["Send Amount", formatMoney(numeric, source)],
                  ["Recipient Receives", formatMoney(received, destination)],
                  ["Recipient Name", recipient.name],
                  ["Bank", recipient.bank],
                  ["Account Number", recipient.account],
                  ["Payout Channel", method],
                  ["Transfer Fee", "Free ($0.00)"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 p-4 text-sm">
                    <span className="text-muted-foreground">{k}</span>
                    <strong className="text-right">{v}</strong>
                  </div>
                ))}
              </div>

              <Button size="lg" className="w-full" onClick={() => setStep("pin")}>
                Authorize with 4-Digit PIN
              </Button>
            </div>
          )}

          {/* PIN STEP */}
          {step === "pin" && (
            <div className="space-y-5 text-center">
              <div>
                <h3 className="text-xl font-semibold">Security PIN Authorization</h3>
                <p className="text-xs text-muted-foreground">Enter your 4 digits to release this transfer.</p>
              </div>

              <div className="flex justify-center gap-3 py-2">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`size-3.5 rounded-full border transition ${
                      pin.length > i ? "border-primary bg-primary" : "border-border"
                    }`}
                  />
                ))}
              </div>

              <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((n, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={n === ""}
                    onClick={() =>
                      n === "⌫"
                        ? setPin((p) => p.slice(0, -1))
                        : setPin((p) => (p.length < 4 ? p + String(n) : p))
                    }
                    className="keypad min-h-12"
                  >
                    {n}
                  </button>
                ))}
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button
                size="lg"
                className="w-full"
                onClick={submit}
                disabled={pin.length !== 4}
              >
                <Send className="mr-2 size-4" /> Confirm & Send
              </Button>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === "success" && (
            <div
              className="relative -m-5 grid min-h-80 place-items-center overflow-hidden rounded-3xl p-5 text-center text-white sm:-m-7 sm:p-7"
              style={{ backgroundColor: GOLD }}
            >
              <SpiralBackground />

              <div className="relative z-10">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-white text-[#96691a]">
                  <Check className="size-8" />
                </span>
                <h2 className="mt-5 font-display text-3xl">Transfer Dispatched</h2>
                <p className="mt-2 text-sm text-white/85">
                  {formatMoney(numeric, source)} sent to {recipient.name} via {method}.
                </p>
                <Button
                  className="mt-6 bg-white text-[#96691a] hover:bg-white/90"
                  size="lg"
                  onClick={reset}
                >
                  Send Another Transfer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}