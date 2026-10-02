import { useEffect, useState } from "react";
import { ArrowLeftRight, Check, ChevronLeft, Copy, LoaderCircle, Shield, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatMoney, formatOunces, goldPrice, rates, swapRateLabel, virtualAccount } from "@/data/mock-data";
import { useCente } from "@/state/cente-context";

/* -------------------------------------------------------------------------- */
/*  Swap assets & pairs                                                       */
/* -------------------------------------------------------------------------- */

const SWAP_ASSET = {
  NGN: { label: "Naira", symbol: "₦", flag: "🇳🇬" },
  USD: { label: "US Dollar", symbol: "$", flag: "🇺🇸" },
  GOLD: { label: "Gold", symbol: "OZ", flag: "🥇" },
};

// Every supported pair, in the order they appear in the pair selector.
const SWAP_PAIRS = [
  { id: "NGN_USD", from: "NGN", to: "USD" },
  { id: "USD_NGN", from: "USD", to: "NGN" },
  { id: "USD_GOLD", from: "USD", to: "GOLD" },
  { id: "GOLD_USD", from: "GOLD", to: "USD" },
  { id: "NGN_GOLD", from: "NGN", to: "GOLD" },
  { id: "GOLD_NGN", from: "GOLD", to: "NGN" },
];

// How many units of `to` one unit of `from` buys.
function swapUnitRate(from, to) {
  if (from === "NGN" && to === "USD") return 1 / rates.NGN_USD;
  if (from === "USD" && to === "NGN") return rates.NGN_USD;
  if (from === "USD" && to === "GOLD") return 1 / goldPrice.USD;
  if (from === "GOLD" && to === "USD") return goldPrice.USD;
  if (from === "NGN" && to === "GOLD") return 1 / goldPrice.NGN;
  if (from === "GOLD" && to === "NGN") return goldPrice.NGN;
  return 0;
}

export function ActionFlow({ kind, open, onOpenChange, presetCurrency = "NGN" }) {
  const { user, balances, gold, completeAction, verified, verify, verifyPhoneOtp, pinSet, setupPin } = useCente();
  const [step, setStep] = useState("form");
  const [currency, setCurrency] = useState(presetCurrency);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [idType, setIdType] = useState("BVN");
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [swapPair, setSwapPair] = useState("NGN_USD");

  useEffect(() => {
    if (open) {
      setCurrency(presetCurrency);
      setStep("form");
      setAmount("");
      setPin("");
      setError("");
      setOtp("");
      setIdNumber("");
      setSwapPair("NGN_USD");
    }
  }, [open, presetCurrency]);

  const numeric = Number(amount) || 0;
  const isSwap = kind === "swap";
  const isFund = kind === "fund";
  const isNigerian = user?.countryCode === "+234" || user?.country === "Nigeria";

  /* ---------------------------------------------------------------------- */
  /*  Swap derivations                                                       */
  /* ---------------------------------------------------------------------- */

  const pair = SWAP_PAIRS.find((p) => p.id === swapPair) ?? SWAP_PAIRS[0];
  const swapFrom = pair.from;
  const swapTo = pair.to;
  const fromAsset = SWAP_ASSET[swapFrom];
  const toAsset = SWAP_ASSET[swapTo];
  const unitRate = swapUnitRate(swapFrom, swapTo);
  const swapEstimatedReturn = numeric > 0 ? numeric * unitRate : 0;
  const rateLabel = swapRateLabel(swapFrom, swapTo);
  const fromBalance = swapFrom === "GOLD" ? (gold?.ounces ?? 0) : (balances[swapFrom] ?? 0);

  const fmtAsset = (value, asset) =>
    asset === "GOLD" ? formatOunces(value) : formatMoney(value, asset);

  const title = {
    fund: "Fund Wallet",
    send: "Send Money",
    swap: `Swap ${SWAP_ASSET[swapFrom].label} → ${SWAP_ASSET[swapTo].label}`,
    save: "Add to Safevest",
    withdraw: "Withdraw Savings",
  }[kind] ?? "Transaction";

  const close = (value) => {
    onOpenChange(value);
    if (!value) {
      setTimeout(() => {
        setStep("form");
        setAmount("");
        setPin("");
        setError("");
      }, 200);
    }
  };

  const handleContinue = () => {
    setError("");
    if (numeric <= 0) return setError("Please enter an amount greater than zero.");

    // Balance validation
    if (isSwap) {
      if (numeric > fromBalance) {
        return setError(
          swapFrom === "GOLD"
            ? `Insufficient gold holding. You have ${formatOunces(fromBalance)}.`
            : `Insufficient ${swapFrom} balance for this swap.`
        );
      }
    } else if (!isFund) {
      if (numeric > (balances[currency] ?? 0)) {
        return setError(`Insufficient ${currency} balance.`);
      }
    }

    // Step 1: Phone SMS OTP gate (TODO: wire real provider)
    if (!user?.phoneVerified) {
      return setStep("otp");
    }

    // Step 2: Lazy JIT KYC check (only on transactions)
    if (!verified) {
      if (isNigerian) {
        return setStep("kyc");
      }
      // Foreign users rely on on-ramp KYC, continue to review
    }

    setStep("review");
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      return setError("Enter the 6-digit SMS OTP code.");
    }
    verifyPhoneOtp();
    setError("");

    // After OTP, check KYC if Nigerian
    if (!verified && isNigerian) {
      setStep("kyc");
    } else {
      setStep("review");
    }
  };

  const handleVerifyKyc = () => {
    if (idNumber.length !== 11) {
      return setError(`Enter a valid 11-digit ${idType}.`);
    }
    setStep("kyc_loading");
    setTimeout(() => {
      verify();
      setStep("review");
    }, 900);
  };

  const handleSubmit = () => {
    if (pin.length !== 4) return setError("Enter your 4-digit security PIN.");
    if (!pinSet) setupPin(pin);

    setStep("loading");
    setTimeout(() => {
      if (isSwap) {
        completeAction({
          type: "swap",
          fromCurrency: swapFrom,
          toCurrency: swapTo,
          fromAmount: numeric,
          toAmount: swapEstimatedReturn,
          amount: numeric,
          currency: swapFrom,
        });
      } else {
        completeAction({
          type: kind,
          amount: numeric,
          currency,
          product: currency,
        });
      }
      setStep("success");
    }, 800);
  };

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[94vh] overflow-y-auto rounded-t-2xl border-border bg-background p-0 sm:bottom-4 sm:max-w-xl sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 border-b border-border bg-background px-5 py-4">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {!["form", "success"].includes(step) && (
                <button onClick={() => setStep("form")} className="mr-1 text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="size-5" />
                </button>
              )}
              {title}
            </SheetTitle>
            <SheetDescription>
              {isSwap ? "Live FX conversion at market liquidity rate" : "Multi-currency individual transactions"}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="p-5 pb-8">
          {/* STEP 1: FORM */}
          {step === "form" && (
            <div className="space-y-5">
              {/* SWAP VIEW */}
              {isSwap ? (
                <>
                  <div className="rounded-xl border border-border bg-secondary/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">Swap Direction</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs text-primary"
                        onClick={() => {
                          const reversed = `${swapTo}_${swapFrom}`;
                          if (SWAP_PAIRS.some((p) => p.id === reversed)) setSwapPair(reversed);
                        }}
                      >
                        <ArrowLeftRight className="size-3.5" /> Switch Pair
                      </Button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-lg border border-primary bg-primary/10 p-3 font-semibold text-primary">
                        <p className="text-xs">You Sell</p>
                        <strong className="text-sm">
                          {fromAsset.flag} {fromAsset.label} ({swapFrom})
                        </strong>
                      </div>
                      <div className="rounded-lg border border-primary bg-primary/10 p-3 font-semibold text-primary">
                        <p className="text-xs">You Buy</p>
                        <strong className="text-sm">
                          {toAsset.flag} {toAsset.label} ({swapTo})
                        </strong>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-xs font-semibold text-muted-foreground">Pair</label>
                      <div className="mt-1 grid grid-cols-2 gap-1.5">
                        {SWAP_PAIRS.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSwapPair(p.id)}
                            className={`rounded-lg border px-2 py-2 text-[11px] font-semibold transition-colors ${
                              p.id === swapPair
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:bg-muted/40"
                            }`}
                          >
                            {SWAP_ASSET[p.from].symbol} → {SWAP_ASSET[p.to].symbol} {p.from}/{p.to}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">
                      Amount to Convert ({swapFrom})
                    </label>
                    <div className="relative mt-1 flex items-center">
                      <span className="flex h-12 items-center rounded-l-lg border border-r-0 border-border bg-secondary px-3 font-semibold text-muted-foreground">
                        {fromAsset.symbol}
                      </span>
                      <Input
                        inputMode="decimal"
                        autoFocus
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                        placeholder="0.00"
                        className="h-12 rounded-l-none pl-3"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Available: {fmtAsset(fromBalance, swapFrom)}
                    </p>
                  </div>

                  {numeric > 0 && (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">You Receive</span>
                        <strong className="text-base text-primary">
                          {fmtAsset(swapEstimatedReturn, swapTo)}
                        </strong>
                      </div>
                      <div className="mt-2 flex justify-between border-t border-border/60 pt-2 text-xs text-muted-foreground">
                        <span>Exchange Rate</span>
                        <span>{rateLabel}</span>
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>Swap Fee</span>
                        <span className="font-medium text-success">Free ($0.00)</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* REGULAR FUND / SAVE VIEW */
                <>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Currency</label>
                    <div className="mt-1 flex gap-2">
                      {["NGN", "USD"].map((c) => (
                        <Button
                          key={c}
                          type="button"
                          variant={currency === c ? "default" : "outline"}
                          onClick={() => setCurrency(c)}
                          className="min-w-24"
                        >
                          {c === "NGN" ? "₦ Naira" : "$ Dollar"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {isFund && currency === "NGN" && (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Dedicated Virtual Account
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Transfer Naira to this bank account from any Nigerian banking app for instant deposit.
                      </p>
                      <div className="mt-4 space-y-2.5 rounded-lg border border-border bg-card p-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bank Name</span>
                          <strong>{virtualAccount.bankName}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Name</span>
                          <strong>{user?.firstName} {user?.lastName} / CENTE</strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Account Number</span>
                          <span className="font-mono text-sm font-bold text-primary">{virtualAccount.accountNumber}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full gap-1.5"
                        onClick={async () => {
                          await navigator.clipboard.writeText(virtualAccount.accountNumber);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                      >
                        <Copy className="size-3.5" />
                        {copied ? "Copied Account Number!" : "Copy Account Number"}
                      </Button>
                    </div>
                  )}

                  {isFund && currency === "USD" && (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Fiat On-Ramp
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Fund with Visa, Mastercard, Apple Pay, or US Bank Transfer via secure licensed ramp.
                      </p>
                      <div className="mt-3 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
                        Instant deposit · 0 extra CENTE fee · Licensed KYC
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">
                      {isFund ? "Amount Transferred" : "Amount"}
                    </label>
                    <div className="relative mt-1 flex items-center">
                      <span className="flex h-12 items-center rounded-l-lg border border-r-0 border-border bg-secondary px-3 font-semibold text-muted-foreground">
                        {currency === "USD" ? "$" : "₦"}
                      </span>
                      <Input
                        inputMode="decimal"
                        autoFocus
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                        placeholder="0.00"
                        className="h-12 rounded-l-none pl-3"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {isFund
                        ? `Enter the exact ${currency} amount deposited`
                        : `Available: ${formatMoney(balances[currency], currency)}`}
                    </p>
                  </div>
                </>
              )}

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button size="lg" className="w-full shadow-gold" onClick={handleContinue}>
                Continue
              </Button>
            </div>
          )}

          {/* STEP 2: PRIVY SMS OTP GATE */}
          {step === "otp" && (
            <div className="space-y-5 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                <Smartphone className="size-7" />
              </span>
              <div>
                <h3 className="text-xl font-semibold">Confirm your Phone Number</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  We sent a 6-digit confirmation code to{" "}
                  <strong>{user?.countryCode} {user?.phone}</strong>
                </p>
              </div>

              <div className="mx-auto max-w-xs">
                <Input
                  className="h-12 text-center font-mono text-lg tracking-widest"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                  autoFocus
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button size="lg" className="w-full shadow-gold" onClick={handleVerifyOtp}>
                Verify SMS Code & Continue
              </Button>
              <button
                type="button"
                onClick={() => setOtp("123456")}
                className="text-xs text-muted-foreground underline hover:text-foreground"
              >
                Auto-fill test code (123456)
              </button>
            </div>
          )}

          {/* STEP 3: QOREID JIT KYC GATE (NIGERIAN USERS) */}
          {step === "kyc" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary shrink-0">
                  <ShieldCheck className="size-6" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">QoreID Identity Verification</h3>
                  <p className="text-xs text-muted-foreground">
                    Required before performing your first transaction under Nigerian regulations.
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

              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Enter 11-digit {idType}
                </label>
                <Input
                  className="mt-1 h-12 font-mono text-sm"
                  inputMode="numeric"
                  maxLength={11}
                  value={idNumber}
                  onChange={(e) => { setIdNumber(e.target.value.replace(/\D/g, "")); setError(""); }}
                  placeholder={`Enter 11-digit ${idType}`}
                  autoFocus
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Matches your legal name ({user?.firstName} {user?.lastName}) via QoreID fuzzy matching.
                </p>
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button size="lg" className="w-full shadow-gold" onClick={handleVerifyKyc}>
                Verify with QoreID
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                AES-256 encrypted · Instant verification
              </p>
            </div>
          )}

          {step === "kyc_loading" && (
            <div className="grid min-h-60 place-items-center text-center">
              <div>
                <LoaderCircle className="mx-auto size-10 animate-spin text-primary" />
                <h4 className="mt-4 font-semibold">Verifying with QoreID…</h4>
                <p className="mt-1 text-xs text-muted-foreground">Matching registry identity and legal name</p>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW TRANSACTION */}
          {step === "review" && (
            <div className="space-y-5">
              <h3 className="font-display text-2xl">Confirm Transaction</h3>
              <div className="divide-y divide-border rounded-xl border border-border bg-card p-2">
                {isSwap ? (
                  <>
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-muted-foreground">You Pay</span>
                      <strong>{fmtAsset(numeric, swapFrom)}</strong>
                    </div>
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-muted-foreground">You Get</span>
                      <strong className="text-primary">{fmtAsset(swapEstimatedReturn, swapTo)}</strong>
                    </div>
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-muted-foreground">Exchange Rate</span>
                      <span>{rateLabel}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-muted-foreground">Action</span>
                      <strong>{title}</strong>
                    </div>
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-muted-foreground">Amount</span>
                      <strong>{formatMoney(numeric, currency)}</strong>
                    </div>
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-muted-foreground">Channel</span>
                      <span>{currency === "NGN" ? "Domestic Bank Rails" : "USD Card / Ramp"}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between p-3 text-sm">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span className="text-success font-medium">Free ($0.00)</span>
                </div>
              </div>

              <Button size="lg" className="w-full shadow-gold" onClick={() => setStep("pin")}>
                Authorize with PIN
              </Button>
            </div>
          )}

          {/* STEP 5: 4-DIGIT PIN KEYPAD */}
          {step === "pin" && (
            <div className="space-y-5 text-center">
              <div>
                <h3 className="text-xl font-semibold">{pinSet ? "Enter Security PIN" : "Create 4-Digit PIN"}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Enter your 4 digits to authorize this transaction.</p>
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

              <Button size="lg" className="w-full shadow-gold" onClick={handleSubmit} disabled={pin.length !== 4}>
                Confirm & Execute
              </Button>
            </div>
          )}

          {/* STEP 6: PROCESSING */}
          {step === "loading" && (
            <div className="grid min-h-60 place-items-center text-center">
              <div>
                <LoaderCircle className="mx-auto size-10 animate-spin text-primary" />
                <p className="mt-4 font-medium">Processing transaction securely…</p>
              </div>
            </div>
          )}

          {/* STEP 7: SUCCESS */}
          {step === "success" && (
            <div className="grid min-h-60 place-items-center text-center">
              <div>
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/12 text-success shadow-lg">
                  <Check className="size-8" />
                </span>
                <h3 className="mt-5 font-display text-3xl">
                  {isSwap ? "Swap Completed!" : "Transaction Successful"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isSwap
                    ? `You received ${fmtAsset(swapEstimatedReturn, swapTo)}`
                    : `Your ${currency} balance has been updated.`}
                </p>
                <Button className="mt-6 w-full shadow-gold" size="lg" onClick={() => close(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

