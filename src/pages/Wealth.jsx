import { useEffect } from "react";
import WealthPageInner from "@/components/cente/wealth-page";

export default function WealthPage() {
  useEffect(() => { document.title = "Safevest Wealth — CENTE"; }, []);
  return <WealthPageInner />;
}
