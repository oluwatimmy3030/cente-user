import { useState, useEffect } from "react";
import { ArrowRight, Check, Search } from "lucide-react";
import { Brand } from "./brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function WelcomeGate() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("welcome");
  const [name, setName] = useState("");
  useEffect(() => {
    if (!localStorage.getItem("cente-onboarded")) setOpen(true);
  }, []);
  const finish = () => {
    localStorage.setItem("cente-onboarded", "1");
    setStep("done");
    setTimeout(() => setOpen(false), 800);
  };
  return (
    <Sheet open={open} onOpenChange={() => {}}>
      <SheetContent side="bottom" className="inset-0 max-h-none w-full border-0 bg-background p-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:max-w-lg sm:rounded-none">
        <div className="flex min-h-full flex-col bg-[radial-gradient(circle_at_100%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_34%)] p-6 sm:p-9">
          {step === "welcome" && (
            <>
              <Brand />
              <div className="my-auto py-12">
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Borderless wealth</p>
                <h2 className="mt-3 font-display text-5xl font-semibold leading-none">Save. Spend.<br /><em className="text-primary">Own gold.</em></h2>
                <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">A premium place for payments, stable value and long-term wealth—built around you.</p>
              </div>
              <Button size="lg" onClick={() => setStep("profile")}>Get started <ArrowRight /></Button>
              <Button variant="ghost" className="min-h-12 text-muted-foreground" onClick={() => setStep("profile")}>I already have an account</Button>
            </>
          )}
          {step === "profile" && (
            <>
              <SheetHeader><SheetTitle className="font-display text-3xl">Complete your profile</SheetTitle><SheetDescription>Only the essentials. This information stays in the demo.</SheetDescription></SheetHeader>
              <div className="mt-8 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input className="h-12" placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input className="h-12" placeholder="Last name" />
                </div>
                <div className="relative"><Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" /><Input className="h-12 pl-10" placeholder="Country" /></div>
                <div className="relative"><Input className="h-12" placeholder="Phone number" /></div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="ghost" className="min-h-12" onClick={() => setStep("welcome")}>Back</Button>
                <Button size="lg" className="flex-1" onClick={finish}>Complete</Button>
              </div>
            </>
          )}
          {step === "done" && (
            <div className="grid min-h-full place-items-center text-center">
              <div>
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/12 text-success"><Check className="size-8" /></span>
                <h3 className="mt-5 font-display text-3xl">Welcome to CENTE</h3>
                <p className="mt-2 text-sm text-muted-foreground">Your profile is ready.</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
