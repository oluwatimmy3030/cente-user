import { useEffect } from "react";
import WalletPageInner from "@/components/cente/wallet-page";

export default function AccountsPage() {
  useEffect(() => { document.title = "Accounts — CENTE"; }, []);
  return <WalletPageInner />;
}