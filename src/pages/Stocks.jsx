import { useEffect } from "react";
import StocksPageInner from "@/components/cente/stocks-page";

export default function StocksPage() {
  useEffect(() => { document.title = "Stocks & Shares — CENTE"; }, []);
  return <StocksPageInner />;
}