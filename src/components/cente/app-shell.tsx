import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, CircleHelp, Home, Landmark, ReceiptText, UserRound, WalletCards } from "lucide-react";
import { Brand } from "./brand";
import { useCente } from "@/state/cente-context";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";
import { SupportSheet } from "./support-sheet";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/wallet", label: "Wallet", icon: WalletCards },
  { to: "/transactions", label: "Transactions", icon: ReceiptText },
  { to: "/wealth", label: "Wealth", icon: Landmark },
  { to: "/profile", label: "Profile", icon: UserRound },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { notifications } = useCente();
  const unread = notifications.filter((n) => !n.read).length;
  const [support, setSupport] = useState(false);
  return <div className="min-h-screen bg-background text-foreground">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-sidebar px-5 py-7 lg:flex lg:flex-col">
      <Brand /><nav className="mt-12 space-y-2">{nav.map((item) => { const Icon=item.icon; const active=path===item.to; return <Link key={item.to} to={item.to} className={`flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium transition ${active ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}><Icon className="size-5" />{item.label}</Link>; })}</nav>
      <button onClick={() => setSupport(true)} className="mt-auto flex min-h-12 items-center gap-3 rounded-lg border border-border px-4 text-sm text-muted-foreground hover:bg-accent"><CircleHelp className="size-5"/>Help & support</button>
    </aside>
    <div className="lg:pl-64"><header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl"><div className="mx-auto grid h-18 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center px-4 sm:px-7"><div className="lg:hidden"><Brand /></div><div className="hidden min-w-0 lg:block"><p className="text-xs text-muted-foreground">CENTE user account</p><p className="truncate text-sm font-medium">Your wealth, in one place</p></div><div className="flex shrink-0 items-center gap-2"><Button variant="ghost" size="icon" aria-label="Support" onClick={() => setSupport(true)}><CircleHelp /></Button><Button asChild variant="ghost" size="icon" className="relative"><Link to="/notifications" aria-label="Notifications"><Bell />{unread>0&&<span className="absolute right-1 top-1 size-2 rounded-full bg-primary"/>}</Link></Button><Link to="/profile" className="grid size-10 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">SA</Link></div></div></header>
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-7 lg:pb-10">{children}</main>
    </div>
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-2 pb-[max(.65rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"><div className="mx-auto grid max-w-xl grid-cols-5">{nav.map((item)=>{const Icon=item.icon; const active=path===item.to; return <Link key={item.to} to={item.to} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium ${active?"text-primary":"text-muted-foreground"}`}><Icon className="size-5"/><span className="truncate">{item.label}</span></Link>})}</div></nav>
    <SupportSheet open={support} onOpenChange={setSupport}/>
  </div>;
}