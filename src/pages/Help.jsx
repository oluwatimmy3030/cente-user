import { useEffect, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { PageTitle } from "@/components/cente/ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  useEffect(() => { document.title = "Help & Support — CENTE"; }, []);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageTitle eyebrow="Support" title="Help & Support" copy="Get help with your CENTE account. This is a frontend-only mock support surface." />
      <div className="panel rounded-xl p-5">
        <div className="flex items-center gap-2 text-primary"><Sparkles className="size-5" /><span className="text-sm font-semibold">CENTE Support</span></div>
        <p className="mt-1 text-xs text-muted-foreground">Mock support · Typical reply in a few minutes</p>
        <div className="mt-5 space-y-3">
          <div className="rounded-xl rounded-bl-sm bg-secondary p-4 text-sm">Hi Samuel, how can we help with your CENTE account today?</div>
          {sent && <div className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-primary p-4 text-sm text-primary-foreground">{message || "I need help with a transaction."}</div>}
        </div>
        <div className="mt-5 flex gap-2">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} className="h-12" placeholder="Type your message…" />
          <Button size="icon" className="size-12" onClick={() => setSent(true)} aria-label="Send message"><Send /></Button>
        </div>
      </div>
    </>
  );
}