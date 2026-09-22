import { useEffect } from "react";
import SendPageInner from "@/components/cente/send-page";

export default function SendPage() {
  useEffect(() => { document.title = "Send Money — CENTE"; }, []);
  return <SendPageInner />;
}