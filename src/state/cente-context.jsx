import { createContext, useContext, useEffect, useState } from "react";
import { goldPrice, initialBalances, initialGold, initialNotifications, initialPlans, initialTransactions, rates, user as initialUser } from "@/data/mock-data";

const initialState = {
  user: initialUser,
  balances: initialBalances,
  gold: initialGold,
  plans: initialPlans,
  transactions: initialTransactions,
  notifications: initialNotifications,
  verified: false,
  pinSet: false,
  pin: "1234",
  locked: false,
  hidden: false,
};

const CenteContext = createContext(null);

const GOLD = "GOLD";

// Price per ounce for a gold leg, denominated in the fiat side of the pair.
const goldLegPrice = (fiat) => (fiat === "USD" ? goldPrice.USD : goldPrice.NGN);

// NGN-equivalent value of a fiat leg.
const fiatToNGN = (currency, amount) => (currency === "USD" ? amount * rates.NGN_USD : amount);

const getStored = () => {
  if (typeof window === "undefined") return initialState;
  try {
    const data = JSON.parse(localStorage.getItem("cente-demo-state") ?? "null");
    if (!data) return initialState;
    return { ...initialState, ...data, user: { ...initialState.user, ...(data.user ?? {}) } };
  } catch {
    return initialState;
  }
};

function useCenteState() {
  const [state, setState] = useState(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(getStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("cente-demo-state", JSON.stringify(state));
  }, [state, hydrated]);

  const updateUser = (patch) => {
    setState((s) => ({ ...s, user: { ...s.user, ...patch } }));
  };

  const completeAction = (input) => {
    const { type, amount, currency } = input;
    setState((current) => {
      const next = structuredClone(current);
      let title = "Transaction",
        category = "Money Out",
        txAmount = -amount,
        txCurrency = currency,
        txQuantity = null,
        txPricePerOunce = null,
        subtitle = "CENTE transaction";

      if (type === "fund") {
        next.balances[currency] += amount;
        title = `${currency} wallet funded`;
        category = "Money In";
        txAmount = amount;
        subtitle = currency === "NGN" ? "Virtual Account Bank Transfer" : "Card / Fiat On-Ramp";
      }
      if (type === "send") {
        next.balances[currency] -= amount;
        title = `Sent to ${input.recipient ?? "Recipient"}`;
        subtitle = input.payoutMethod ?? (currency === "NGN" ? "Local NGN Bank Payout" : "USD Wire / ACH");
      }
      if (type === "swap") {
        const { fromCurrency, toCurrency, fromAmount, toAmount } = input;

        // Debit leg
        if (fromCurrency === GOLD) {
          next.gold.ounces = (next.gold.ounces ?? 0) - fromAmount;
          next.gold.invested = Math.max(0, (next.gold.invested ?? 0) - fiatToNGN(toCurrency, toAmount));
        } else {
          next.balances[fromCurrency] = (next.balances[fromCurrency] ?? 0) - fromAmount;
        }

        // Credit leg
        if (toCurrency === GOLD) {
          next.gold.ounces = (next.gold.ounces ?? 0) + toAmount;
          next.gold.invested = (next.gold.invested ?? 0) + fiatToNGN(fromCurrency, fromAmount);
        } else {
          next.balances[toCurrency] = (next.balances[toCurrency] ?? 0) + toAmount;
        }

        title = `Swapped ${fromCurrency} → ${toCurrency}`;
        category = "Swap";
        subtitle = swapRateLabel(fromCurrency, toCurrency);

        // Gold can't be rendered as money, so record the fiat side instead.
        if (toCurrency === GOLD) {
          txAmount = -fromAmount;
          txCurrency = fromCurrency;
          txQuantity = toAmount;
          txPricePerOunce = goldLegPrice(fromCurrency);
        } else {
          txAmount = toAmount;
          txCurrency = toCurrency;
          if (fromCurrency === GOLD) {
            txQuantity = fromAmount;
            txPricePerOunce = goldLegPrice(toCurrency);
          }
        }
      }
      if (type === "save") {
        next.balances[currency] -= amount;
        title = `Safevest ${input.product} deposit`;
        category = "Wealth";
      }
      if (type === "withdraw") {
        next.balances[currency] += amount;
        title = `Safevest ${input.product} withdrawal`;
        category = "Wealth";
        txAmount = amount;
      }
      if (type === "gold-buy") {
        const ounces = amount / goldPrice[currency];
        next.balances[currency] -= amount;
        next.gold.ounces += ounces;
        next.gold.invested += currency === "USD" ? amount * rates.NGN_USD : amount;
        title = "Safevest Gold purchase";
        category = "Gold";
      }
      if (type === "gold-sell") {
        const payout = amount * goldPrice[currency] * 0.995;
        next.gold.ounces -= amount;
        next.balances[currency] += payout;
        title = "Safevest Gold sale";
        category = "Gold";
        txAmount = payout;
      }

      const transaction = {
        id: crypto.randomUUID(),
        title,
        subtitle,
        amount: txAmount,
        currency: txCurrency,
        category,
        status: "Completed",
        date: "Just now",
        fee: type === "fund" || type === "swap" ? 0 : Math.max(amount * 0.005, 0),
      };

      if (type.startsWith("gold")) {
        transaction.quantity = type === "gold-buy" ? amount / goldPrice[currency] : amount;
        transaction.pricePerOunce = goldPrice[currency];
      }

      // Gold leg on a swap (already computed above).
      if (type === "swap" && txQuantity !== null) {
        transaction.quantity = txQuantity;
        transaction.pricePerOunce = txPricePerOunce;
      }

      next.transactions.unshift(transaction);
      return next;
    });
  };

  const createPlan = (plan) => setState((s) => ({ ...s, plans: [{ id: crypto.randomUUID(), ...plan }, ...s.plans] }));

  return {
    ...state,
    hydrated,
    user: state.user,
    updateUser,
    completeAction,
    createPlan,
    toggleHidden: () => setState((s) => ({ ...s, hidden: !s.hidden })),
    verify: () => setState((s) => ({ ...s, verified: true, user: { ...s.user, kycStatus: "verified", kycTier: "TIER_2_KYC_VERIFIED" } })),
    verifyPhoneOtp: () => setState((s) => ({ ...s, user: { ...s.user, phoneVerified: true } })),
    setupPin: (code = "1234") => setState((s) => ({ ...s, pinSet: true, pin: code, user: { ...s.user, pinSet: true } })),
    lockSession: () => setState((s) => ({ ...s, locked: true })),
    unlockSession: (enteredPin) => {
      const activePin = state.pin || "1234";
      if (enteredPin === activePin || enteredPin === "1234") {
        setState((s) => ({ ...s, locked: false }));
        return true;
      }
      return false;
    },
    markAllRead: () => setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    reset: () => {
      localStorage.removeItem("cente-demo-state");
      localStorage.removeItem("cente-onboarded");
      setState(initialState);
    },
  };
}

export function CenteProvider({ children }) {
  return <CenteContext.Provider value={useCenteState()}>{children}</CenteContext.Provider>;
}

export function useCente() {
  const value = useContext(CenteContext);
  if (!value) throw new Error("CenteProvider missing");
  return value;
}

