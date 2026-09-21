import { useEffect } from "react";
import TransactionsPageInner from "@/components/cente/transactions-page";

export default function TransactionsPage() {
  useEffect(() => { document.title = "Transactions — CENTE"; }, []);
  return <TransactionsPageInner />;
}
