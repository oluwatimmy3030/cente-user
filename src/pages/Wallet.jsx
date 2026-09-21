import { useEffect } from "react";
import WalletPageInner from "@/components/cente/wallet-page";

export default function WalletPage() {
  useEffect(() => { document.title = "Wallet — CENTE"; }, []);
  return <WalletPageInner />;
}
