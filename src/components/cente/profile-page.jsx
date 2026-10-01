// src/components/cente/profile-page.jsx
import { useState } from "react";
import {
  Bell,
  ChevronRight,
  FileText,
  Globe2,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  UserRound,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { PageTitle } from "./ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCente } from "@/state/cente-context";
import { user } from "@/data/mock-data";

export default function ProfilePage() {
  const { verified, pinSet, verify, setupPin, reset } = useCente();
  const [sheet, setSheet] = useState(null);
  const [digits, setDigits] = useState("");
  const [bvn, setBvn] = useState("");

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  const rows = [
    {
      icon: UserRound,
      label: "Personal information",
      value: `${user.firstName} ${user.lastName}`,
    },
    {
      icon: ShieldCheck,
      label: "BVN verification",
      value: verified ? "Verified" : "Not verified",
      action: () => setSheet("verify"),
      tone: verified ? "success" : "warning",
    },
    {
      icon: LockKeyhole,
      label: "Security PIN",
      value: pinSet ? "Active" : "Set up",
      action: () => {
        setDigits("");
        setSheet("pin");
      },
      tone: pinSet ? "success" : "warning",
    },
    { icon: Bell, label: "Notifications", value: "Enabled" },
    { icon: Globe2, label: "Privacy", value: "Review" },
    { icon: FileText, label: "Terms", value: "Review" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-20 sm:space-y-8 [contain:layout]">
      <PageTitle
        eyebrow="Settings"
        title="Profile & Security"
        copy="Manage your mock profile, verification and security preferences."
      />

      <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
        {/* ------------------------------------------------------------ */}
        {/*  Profile card                                                */}
        {/* ------------------------------------------------------------ */}
        <div className="panel overflow-hidden">
          {/* Cover / header strip */}
          <div className="relative h-24 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5), transparent 40%)," +
                  "radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4), transparent 40%)",
              }}
            />
          </div>

          <div className="relative -mt-12 px-5 pb-5 text-center sm:px-6 sm:pb-6">
            {/* Avatar */}
            <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-primary text-3xl font-semibold text-primary-foreground shadow-lg ring-4 ring-background">
              {initials || "SA"}
            </div>

            <button
              type="button"
              className="absolute right-5 top-14 grid size-8 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground sm:right-6"
              aria-label="Change avatar"
            >
              <Camera className="size-3.5" />
            </button>

            <h2 className="mt-4 truncate font-display text-xl font-semibold sm:text-2xl">
              {user.firstName} {user.lastName}
            </h2>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {user.countryCode} {user.phone}
            </p>

            <div className="mt-4 flex justify-center">
              <span
                className={[
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1",
                  verified
                    ? "bg-emerald-500/12 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400"
                    : "bg-amber-500/12 text-amber-600 ring-amber-500/20 dark:text-amber-400",
                ].join(" ")}
              >
                {verified ? (
                  <CheckCircle2 className="size-3" />
                ) : (
                  <ShieldCheck className="size-3" />
                )}
                {verified ? "Verified account" : "Verification available"}
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Settings rows                                               */}
        {/* ------------------------------------------------------------ */}
        <div className="space-y-4">
          <div className="panel overflow-hidden">
            <ul className="divide-y divide-border">
              {rows.map(({ icon: Icon, label, value, action, tone }) => {
                const Wrapper = action ? "button" : "div";
                const wrapperProps = action
                  ? { type: "button", onClick: action }
                  : {};

                return (
                  <li key={label}>
                    <Wrapper
                      {...wrapperProps}
                      className={[
                        "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 text-left sm:px-5",
                        action
                          ? "transition-colors hover:bg-muted/40"
                          : "cursor-default",
                      ].join(" ")}
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                        <Icon className="size-4" />
                      </span>

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {label}
                        </span>
                        <span
                          className={[
                            "block truncate text-xs",
                            tone === "success"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : tone === "warning"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-muted-foreground",
                          ].join(" ")}
                        >
                          {value}
                        </span>
                      </span>

                      {action ? (
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <span className="size-4 shrink-0" aria-hidden />
                      )}
                    </Wrapper>
                  </li>
                );
              })}
            </ul>
          </div>

          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => setSheet("logout")}
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  BVN verification sheet                                          */}
      {/* ---------------------------------------------------------------- */}
      <Sheet open={sheet === "verify"} onOpenChange={() => setSheet(null)}>
        <SheetContent
          side="bottom"
          className="mx-auto rounded-t-2xl bg-background sm:bottom-4 sm:max-w-xl sm:rounded-2xl"
        >
          <SheetHeader>
            <SheetTitle>BVN verification</SheetTitle>
            <SheetDescription>
              Mock verification for Nigerian users. No identity service is connected.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-5 pb-8 pt-6">
            <Input
              inputMode="numeric"
              maxLength={11}
              value={bvn}
              onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 11-digit BVN"
            />
            <Button
              disabled={bvn.length !== 11}
              className="w-full"
              onClick={() => {
                verify();
                setSheet(null);
                setBvn("");
              }}
            >
              Verify BVN
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ---------------------------------------------------------------- */}
      {/*  PIN sheet                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Sheet open={sheet === "pin"} onOpenChange={() => setSheet(null)}>
        <SheetContent
          side="bottom"
          className="mx-auto rounded-t-2xl bg-background sm:bottom-4 sm:max-w-xl sm:rounded-2xl"
        >
          <SheetHeader>
            <SheetTitle>
              {pinSet ? "Enter security PIN" : "Set up security PIN"}
            </SheetTitle>
            <SheetDescription>
              Your PIN is stored locally for this demo only.
            </SheetDescription>
          </SheetHeader>

          {/* PIN dots */}
          <div className="my-6 flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={[
                  "size-4 rounded-full border transition-colors",
                  digits.length > i
                    ? "border-primary bg-primary"
                    : "border-border",
                ].join(" ")}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="mx-auto grid max-w-xs grid-cols-3 gap-2 px-5 pb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((n, i) => (
              <button
                key={i}
                type="button"
                disabled={n === ""}
                onClick={() =>
                  n === "⌫"
                    ? setDigits((p) => p.slice(0, -1))
                    : setDigits((p) => (p.length < 4 ? p + String(n) : p))
                }
                className="keypad"
              >
                {n}
              </button>
            ))}
            <Button
              className="col-span-3 mt-2"
              disabled={digits.length !== 4}
              onClick={() => {
                setupPin();
                setSheet(null);
                setDigits("");
              }}
            >
              Save PIN
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ---------------------------------------------------------------- */}
      {/*  Logout sheet                                                    */}
      {/* ---------------------------------------------------------------- */}
      <Sheet open={sheet === "logout"} onOpenChange={() => setSheet(null)}>
        <SheetContent
          side="bottom"
          className="mx-auto rounded-t-2xl bg-background sm:bottom-4 sm:max-w-xl sm:rounded-2xl"
        >
          <SheetHeader>
            <SheetTitle>Log out?</SheetTitle>
            <SheetDescription>
              Your local demo state will be reset.
            </SheetDescription>
          </SheetHeader>

          <div className="flex gap-2 px-5 pb-8 pt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setSheet(null)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                reset();
                setSheet(null);
              }}
            >
              Log out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}