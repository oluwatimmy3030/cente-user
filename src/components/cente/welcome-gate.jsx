import { useState, useEffect } from "react";
import { ArrowRight, Check, ChevronDown, Globe, Shield, Smartphone, User } from "lucide-react";
import { Brand } from "./brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { countries } from "@/data/mock-data";
import { useCente } from "@/state/cente-context";

export function WelcomeGate() {
  const { user, updateUser } = useCente();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("welcome");
  const [firstName, setFirstName] = useState(user?.firstName ?? "Samuel");
  const [lastName, setLastName] = useState(user?.lastName ?? "Adeyemi");
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.dialCode === (user?.countryCode ?? "+234")) || countries[0]
  );
  const [phone, setPhone] = useState(user?.phone ?? "801 234 5678");
  const [countrySearch, setCountrySearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("cente-onboarded")) setOpen(true);
  }, []);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch)
  );

  const handleComplete = () => {
    if (!firstName.trim() || !lastName.trim()) {
      return setError("Please provide your first and last name.");
    }
    if (!phone.trim()) {
      return setError("Please enter your phone number.");
    }

    updateUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      country: selectedCountry.name,
      countryCode: selectedCountry.dialCode,
      isoCode: selectedCountry.code,
      phone: phone.trim(),
    });

    localStorage.setItem("cente-onboarded", "1");
    setStep("done");
    setTimeout(() => setOpen(false), 800);
  };

  return (
    <Sheet open={open} onOpenChange={() => {}}>
      <SheetContent
        side="bottom"
        className="inset-0 max-h-none w-full border-0 bg-background p-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:max-w-lg sm:rounded-none"
      >
        <div className="flex min-h-full flex-col bg-[radial-gradient(circle_at_100%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_34%)] p-6 sm:p-9">
          {step === "welcome" && (
            <>
              <Brand />
              <div className="my-auto py-10">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  <Shield className="size-3.5" /> Individual Accounts Only
                </div>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                  Save. Spend.<br />
                  <em className="text-primary not-italic">Grow in USD & NGN.</em>
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                  A high-yield multi-currency wallet built for seamless payments, real-time swaps, and Safevest plans.
                </p>

                <div className="mt-6 flex flex-col gap-2 rounded-xl border border-border bg-card/60 p-4 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <span className="grid size-5 place-items-center rounded-full bg-primary/20 text-primary">✓</span>
                    No business onboarding (Individuals only in V1)
                  </p>
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <span className="grid size-5 place-items-center rounded-full bg-primary/20 text-primary">✓</span>
                    Explore features freely before identity verification
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button size="lg" className="w-full gap-2 shadow-gold" onClick={() => setStep("profile")}>
                  Continue with Privy <ArrowRight className="size-4" />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Secured by Privy Auth · Web3 & Email Verification
                </p>
              </div>
            </>
          )}

          {step === "profile" && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display text-2xl sm:text-3xl">Complete your profile</SheetTitle>
                <SheetDescription>
                  Enter your details to access your CENTE dashboard. Verification is only required when you transact.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">First name</label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
                      <Input
                        className="h-12 pl-10"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value); setError(""); }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Last name</label>
                    <div className="relative mt-1">
                      <Input
                        className="h-12"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value); setError(""); }}
                      />
                    </div>
                  </div>
                </div>

                {/* Country dropdown with flag and search */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Country & Dial Code (IDD)</label>
                  <div className="relative mt-1">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex h-12 w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-sm transition hover:border-primary/50"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <strong className="font-medium">{selectedCountry.name}</strong>
                        <span className="text-xs text-muted-foreground">({selectedCountry.dialCode})</span>
                      </span>
                      <ChevronDown className={`size-4 text-muted-foreground transition ${dropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute left-0 right-0 top-13 z-50 max-h-60 overflow-y-auto rounded-lg border border-border bg-card p-2 shadow-xl">
                        <Input
                          placeholder="Search country or code..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="mb-2 h-9 text-xs"
                          autoFocus
                        />
                        <div className="space-y-1">
                          {filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setDropdownOpen(false);
                                setCountrySearch("");
                              }}
                              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs transition ${
                                selectedCountry.code === c.code ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-base">{c.flag}</span>
                                <span>{c.name}</span>
                              </span>
                              <span className="font-mono text-muted-foreground">{c.dialCode}</span>
                            </button>
                          ))}
                          {filteredCountries.length === 0 && (
                            <p className="p-2 text-center text-xs text-muted-foreground">No matching country</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone input with country code prefix */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Phone number</label>
                  <div className="relative mt-1 flex items-center">
                    <span className="flex h-12 items-center rounded-l-lg border border-r-0 border-border bg-secondary px-3 font-mono text-xs font-semibold text-foreground">
                      {selectedCountry.dialCode}
                    </span>
                    <Input
                      className="h-12 rounded-l-none pl-3"
                      placeholder="801 234 5678"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setError(""); }}
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>

              <div className="mt-8 flex gap-2">
                <Button variant="ghost" className="min-h-12" onClick={() => setStep("welcome")}>
                  Back
                </Button>
                <Button size="lg" className="flex-1 shadow-gold" onClick={handleComplete}>
                  Access App <ArrowRight className="size-4" />
                </Button>
              </div>
            </>
          )}

          {step === "done" && (
            <div className="grid min-h-full place-items-center text-center">
              <div>
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/12 text-success shadow-lg">
                  <Check className="size-8" />
                </span>
                <h3 className="mt-5 font-display text-3xl">Welcome to CENTE</h3>
                <p className="mt-2 text-sm text-muted-foreground">Your profile is ready. Explore features and live rates.</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
