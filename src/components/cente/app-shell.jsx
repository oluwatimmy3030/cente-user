import { Link, useLocation } from "react-router-dom";
import { Bell, Building2, CircleHelp, Home, Landmark, Menu, ReceiptText, Send, Settings, TrendingUp } from "lucide-react";
import { Brand } from "./brand";
import { useCente } from "@/state/cente-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: Home }, { to: "/transactions", label: "Transactions", icon: ReceiptText },
  { to: "/stocks", label: "Stocks & Shares", icon: TrendingUp }, { to: "/wealth", label: "Wealth", icon: Landmark },
  { to: "/send", label: "Send Money", icon: Send }, { to: "/accounts", label: "Accounts", icon: Building2 },
  { to: "/settings", label: "Settings", icon: Settings }, { to: "/help", label: "Help", icon: CircleHelp },
];
const mobileNav = [nav[0], nav[1], nav[2], nav[3]];
export function AppShell({ children }) {
  const { pathname } = useLocation(); const { notifications } = useCente(); const unread = notifications.filter((n) => !n.read).length; const [more, setMore] = useState(false);
  const NavLink = ({ item, mobile = false }) => { const Icon = item.icon; const active = pathname === item.to; return <Link to={item.to} onClick={() => setMore(false)} className={mobile ? `flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}` : `flex min-h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium transition ${active ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}><Icon className="size-5" /><span className="truncate">{item.label}</span></Link> };
  return <div className="min-h-screen bg-background text-foreground">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-68 border-r border-border bg-sidebar px-5 py-7 lg:flex lg:flex-col"><Brand /><nav className="mt-10 space-y-1">{nav.map((item) => <NavLink key={item.to} item={item} />)}</nav><p className="mt-auto px-4 text-xs text-muted-foreground">Frontend prototype · Mock data</p></aside>
    <div className="lg:pl-68"><header className="sticky top-0 z-30 border-b border-border/70 bg-background/92 backdrop-blur-xl"><div className="mx-auto grid h-18 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center px-4 sm:px-7"><div className="lg:hidden"><Brand /></div><div className="hidden lg:block"><p className="text-xs text-muted-foreground">CENTE user account</p><p className="text-sm font-medium">Your wealth, in one place</p></div><div className="flex items-center gap-2"><Button asChild variant="ghost" size="icon" className="relative"><Link to="/notifications" aria-label="Notifications"><Bell />{unread > 0 && <span className="absolute right-1 top-1 size-2 rounded-full bg-primary" />}</Link></Button><Link to="/accounts" className="grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-gold">SA</Link></div></div></header><main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-7 lg:pb-10">{children}</main></div>
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/96 px-1 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-xl lg:hidden"><div className="mx-auto grid max-w-xl grid-cols-5">{mobileNav.map((item) => <NavLink key={item.to} item={item} mobile />)}<Button variant="ghost" onClick={() => setMore(true)} className="h-auto min-h-14 flex-col gap-1 rounded-none text-[10px] text-muted-foreground"><Menu className="size-5" />More</Button></div></nav>
    <Sheet open={more} onOpenChange={setMore}><SheetContent side="bottom" className="rounded-t-2xl bg-background"><SheetHeader><SheetTitle>More</SheetTitle></SheetHeader><div className="grid grid-cols-2 gap-2 px-5 pb-8 pt-5">{nav.slice(4).map((item) => <NavLink key={item.to} item={item} />)}</div></SheetContent></Sheet>
  </div>;
}
