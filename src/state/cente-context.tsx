import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { goldPrice, initialBalances, initialGold, initialNotifications, initialTransactions, type Currency, type Transaction } from "@/data/mock-data";

type ActionType = "fund" | "send" | "swap" | "save" | "withdraw" | "gold-buy" | "gold-sell";
type ActionInput = { type: ActionType; amount: number; currency: Currency; to?: Currency; recipient?: string; product?: "NGN" | "USD" };
type State = {
  balances: Record<Currency, number>;
  gold: typeof initialGold;
  transactions: Transaction[];
  notifications: typeof initialNotifications;
  verified: boolean;
  pinSet: boolean;
  hidden: boolean;
};

const initialState: State = { balances: initialBalances, gold: initialGold, transactions: initialTransactions, notifications: initialNotifications, verified: false, pinSet: false, hidden: false };
const CenteContext = createContext<ReturnType<typeof useCenteState> | null>(null);

const getStored = (): State => {
  if (typeof window === "undefined") return initialState;
  try { return JSON.parse(localStorage.getItem("cente-demo-state") ?? "null") ?? initialState; } catch { return initialState; }
};

function useCenteState() {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setState(getStored()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("cente-demo-state", JSON.stringify(state)); }, [state, hydrated]);

  const completeAction = (input: ActionInput) => {
    const { type, amount, currency } = input;
    const next = structuredClone(state);
    let title = "Transaction";
    let category: Transaction["category"] = "Money Out";
    let txAmount = -amount;
    if (type === "fund") { next.balances[currency] += amount; title = "Wallet funded"; category = "Money In"; txAmount = amount; }
    if (type === "send") { next.balances[currency] -= amount; title = `Sent to ${input.recipient ?? "recipient"}`; }
    if (type === "swap" && input.to) {
      const rate = currency === "NGN" && input.to === "USD" ? 1 / 1548.2 : currency === "NGN" && input.to === "USDT" ? 1 / 1561.4 : currency === "USD" && input.to === "USDT" ? 1.008 : currency === "USDT" && input.to === "USD" ? 1 / 1.008 : currency === "USD" && input.to === "NGN" ? 1548.2 : 1561.4;
      next.balances[currency] -= amount; next.balances[input.to] += amount * rate * .995; title = `${input.to} swap`; category = "Swaps";
    }
    if (type === "save") { next.balances[currency] -= amount; title = `Safevest ${input.product} deposit`; category = "Wealth"; }
    if (type === "withdraw") { next.balances[currency] += amount; title = `Safevest ${input.product} withdrawal`; category = "Wealth"; txAmount = amount; }
    if (type === "gold-buy") { const grams = amount / goldPrice[currency === "USD" ? "USD" : "NGN"]; next.balances[currency] -= amount; next.gold.grams += grams; next.gold.invested += currency === "USD" ? amount * 1548.2 : amount; title = "Safevest Gold purchase"; category = "Gold"; }
    if (type === "gold-sell") { const payout = amount * goldPrice[currency === "USD" ? "USD" : "NGN"] * .995; next.gold.grams -= amount; next.balances[currency] += payout; title = "Safevest Gold redemption"; category = "Gold"; txAmount = payout; }
    next.balances.GOLD = next.gold.grams * goldPrice.NGN;
    next.transactions.unshift({ id: crypto.randomUUID(), title, subtitle: "CENTE demo transaction", amount: txAmount, currency, category, status: "Completed", date: "Just now", quantity: type.startsWith("gold") ? (type === "gold-buy" ? amount / goldPrice[currency === "USD" ? "USD" : "NGN"] : amount) : undefined, fee: Math.max(amount * .005, 0) });
    setState(next);
  };
  return { ...state, hydrated, completeAction, toggleHidden: () => setState((s) => ({ ...s, hidden: !s.hidden })), verify: () => setState((s) => ({ ...s, verified: true })), setupPin: () => setState((s) => ({ ...s, pinSet: true })), markAllRead: () => setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })), reset: () => setState(initialState) };
}

export function CenteProvider({ children }: { children: ReactNode }) { return <CenteContext.Provider value={useCenteState()}>{children}</CenteContext.Provider>; }
export function useCente() { const value = useContext(CenteContext); if (!value) throw new Error("CenteProvider missing"); return value; }