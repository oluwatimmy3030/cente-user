import { useState } from "react";
import { Bell, ChevronRight, CircleHelp, FileText, Globe2, LockKeyhole, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { PageTitle } from "@/components/cente/ui";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCente } from "@/state/cente-context";
import { user } from "@/data/mock-data";

const sheetTypes = ["verify", "pin", "logout"];

export default function ProfilePage() {
  const { verified, pinSet, verify, setupPin, reset } = useCente();
  const [sheet, setSheet] = useState(null);
  const [digits, setDigits] = useState("");
  const rows = [
    { icon: ShieldCheck, label: "Identity verification", value: verified ? "Verified" : "Not verified", action: () => setSheet("verify") },
    { icon: LockKeyhole, label: "Security PIN", value: pinSet ? "Active" : "Set up", action: () => setSheet("pin") },
    { icon: Bell, label: "Notifications", value: "Enabled" },
    { icon: CircleHelp, label: "Support", value: "Available" },
    { icon: Globe2, label: "Privacy", value: "Review" },
    { icon: FileText, label: "Terms", value: "Review" },
  ];
  return (
    <>
      <PageTitle eyebrow="Your account" title="Profile" />
      <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
        <div className="panel p-6 text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-primary/12 text-2xl font-semibold text-primary">SA</span>
          <h2 className="mt-4 font-display text-2xl">{user.firstName} {user.lastName}</h2>
          <p className="text-sm text-muted-foreground">{user.countryCode} {user.phone}</p>
          <span className={`mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${verified ? "bg-success/12 text-success" : "bg-warning/12 text-warning"}`}>
            <ShieldCheck className="size-3" /> {verified ? "Verified account" : "Verification available"}
          </span>
          <div className="mt-6 grid grid-cols-2 gap-3 text-left text-xs">
            <div className="rounded-lg bg-secondary p-3"><span className="text-muted-foreground">Country</span><strong className="mt-1 block">🇳🇬 Nigeria</strong></div>
            <div className="rounded-lg bg-secondary p-3"><span className="text-muted-foreground">Wallet ID</span><strong className="mt-1 block">•• 1965</strong></div>
          </div>
        </div>
        <div className="panel divide-y divide-border">
          {rows.map(({ icon: Icon, label, value, action }) => (
            <button key={label} onClick={action} className="grid min-h-16 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 text-left">
              <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-4" /></span>
              <div className="min-w-0">
                <span className="block text-sm font-medium">{label}</span>
                <span className="block text-xs text-muted-foreground">{value}</span>
              </div>
              {action && <ChevronRight className="size-4 text-muted-foreground" />}
            </button>
          ))}
          <div className="p-5">
            <Button variant="outline" className="w-full" onClick={() => setSheet("logout")}><LogOut className="size-4" /> Log out</Button>
          </div>
        </div>
      </div>
      <Sheet open={sheet === "verify"} onOpenChange={() => setSheet(null)}>
        <SheetContent side="bottom" className="mx-auto rounded-t-2xl border-border bg-background sm:bottom-4 sm:max-w-xl sm:rounded-2xl">
          <SheetHeader><SheetTitle>Identity verification</SheetTitle><SheetDescription>Mock verification · No identity service is connected.</SheetDescription></SheetHeader>
          <div className="my-6 grid grid-cols-2 gap-2">
            <button className="choice-active">BVN</button>
            <button className="choice">NIN</button>
          </div>
          <div className="flex gap-2 px-5 pb-8"><input className="field" placeholder="Enter verification number" /><Button className="w-full" onClick={() => { verify(); setSheet(null); }}>Verify</Button></div>
        </SheetContent>
      </Sheet>
      <Sheet open={sheet === "pin"} onOpenChange={() => setSheet(null)}>
        <SheetContent side="bottom" className="mx-auto rounded-t-2xl border-border bg-background sm:bottom-4 sm:max-w-xl sm:rounded-2xl">
          <SheetHeader><SheetTitle>{pinSet ? "Enter security PIN" : "Set up security PIN"}</SheetTitle></SheetHeader>
          <div className="my-6 flex justify-center gap-3 px-5 pb-8">
            {[0, 1, 2, 3].map((i) => <span key={i} className={`size-4 rounded-full border ${digits.length > i ? "border-primary bg-primary" : "border-border"}`} />)}
          </div>
          <div className="grid grid-cols-3 gap-2 px-5 pb-8 max-w-xs mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((n, i) => (
              <button key={i} disabled={n === ""} onClick={() => n === "⌫" ? setDigits((p) => p.slice(0, -1)) : setDigits((p) => p.length < 4 ? p + String(n) : p)} className="keypad">{n}</button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={sheet === "logout"} onOpenChange={() => setSheet(null)}>
        <SheetContent side="bottom" className="mx-auto rounded-t-2xl border-border bg-background sm:bottom-4 sm:max-w-xl sm:rounded-2xl">
          <SheetHeader><SheetTitle>Log out?</SheetTitle><SheetDescription>You will need to sign in again.</SheetDescription></SheetHeader>
          <div className="my-6 flex gap-2 px-5 pb-8">
            <Button variant="outline" className="flex-1" onClick={() => setSheet(null)}>Cancel</Button>
            <Button className="flex-1" onClick={() => { reset(); setSheet(null); }}>Log out</Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
