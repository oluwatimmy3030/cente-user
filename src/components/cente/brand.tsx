import { Gem } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-gold"><Gem className="size-5" /></span>{!compact && <span className="font-display text-xl font-semibold tracking-[0.14em] text-foreground">CENTE</span>}</div>;
}