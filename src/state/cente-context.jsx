import { createContext, useContext, useEffect, useState } from "react";
import { goldPrice, initialBalances, initialGold, initialNotifications, initialPlans, initialTransactions, rates } from "@/data/mock-data";

const initialState = { balances: initialBalances, gold: initialGold, plans: initialPlans, transactions: initialTransactions, notifications: initialNotifications, verified: false, pinSet: false, hidden: false };
const CenteContext = createContext(null);
const getStored = () => { if (typeof window === "undefined") return initialState; try { return JSON.parse(localStorage.getItem("cente-demo-state") ?? "null") ?? initialState; } catch { return initialState; } };

function useCenteState() {
  const [state, setState] = useState(initialState);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setState(getStored()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("cente-demo-state", JSON.stringify(state)); }, [state, hydrated]);
  const completeAction = (input) => {
    const { type, amount, currency } = input;
    setState((current) => {
      const next = structuredClone(current);
      let title = "Transaction", category = "Money Out", txAmount = -amount, subtitle = "CENTE demo transaction";
      if (type === "fund") { next.balances[currency] += amount; title = `${currency} wallet funded`; category = "Money In"; txAmount = amount; subtitle = "Bank transfer confirmation"; }
      if (type === "send") { next.balances[currency] -= amount; title = `Sent to ${input.recipient ?? "recipient"}`; subtitle = input.payoutMethod ?? "Bank transfer"; }
      if (type === "save") { next.balances[currency] -= amount; title = `Safevest ${input.product} deposit`; category = "Wealth"; }
      if (type === "withdraw") { next.balances[currency] += amount; title = `Safevest ${input.product} withdrawal`; category = "Wealth"; txAmount = amount; }
      if (type === "gold-buy") { const ounces = amount / goldPrice[currency]; next.balances[currency] -= amount; next.gold.ounces += ounces; next.gold.invested += currency === "USD" ? amount * rates.NGN_USD : amount; title = "Safevest Gold purchase"; category = "Gold"; }
      if (type === "gold-sell") { const payout = amount * goldPrice[currency] * 0.995; next.gold.ounces -= amount; next.balances[currency] += payout; title = "Safevest Gold sale"; category = "Gold"; txAmount = payout; }
      const transaction = { id: crypto.randomUUID(), title, subtitle, amount: txAmount, currency, category, status: "Completed", date: "Just now", fee: type === "fund" ? 0 : Math.max(amount * 0.005, 0) };
      if (type.startsWith("gold")) { transaction.quantity = type === "gold-buy" ? amount / goldPrice[currency] : amount; transaction.pricePerOunce = goldPrice[currency]; }
      next.transactions.unshift(transaction); return next;
    });
  };
  const createPlan = (plan) => setState((s) => ({ ...s, plans: [{ id: crypto.randomUUID(), ...plan }, ...s.plans] }));
  return { ...state, hydrated, completeAction, createPlan, toggleHidden: () => setState((s) => ({ ...s, hidden: !s.hidden })), verify: () => setState((s) => ({ ...s, verified: true })), setupPin: () => setState((s) => ({ ...s, pinSet: true })), markAllRead: () => setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })), reset: () => setState(initialState) };
}
export function CenteProvider({ children }) { return <CenteContext.Provider value={useCenteState()}>{children}</CenteContext.Provider>; }
export function useCente() { const value = useContext(CenteContext); if (!value) throw new Error("CenteProvider missing"); return value; }
