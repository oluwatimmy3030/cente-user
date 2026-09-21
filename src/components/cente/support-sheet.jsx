import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SupportSheet({ open, onOpenChange }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[85vh] max-w-2xl rounded-t-2xl border-border bg-background sm:bottom-4 sm:rounded-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Sparkles className="text-primary" />CENTE Support</SheetTitle>
          <SheetDescription>Mock support · Typical reply in a few minutes</SheetDescription>
        </SheetHeader>
        <div className="my-6 space-y-3">
          <div className="max-w-[85%] rounded-xl rounded-bl-sm bg-secondary p-4 text-sm">Hi Samuel, how can we help with your CENTE account today?</div>
          {sent && <div className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-primary p-4 text-sm text-primary-foreground">{message || "I need help with a transaction."}</div>}
        </div>
        <div className="flex gap-2">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} className="h-12" placeholder="Type your message…" />
          <Button size="icon" className="size-12" onClick={() => setSent(true)} aria-label="Send message"><Send /></Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
