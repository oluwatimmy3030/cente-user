import lightLogo from "@/assets/cente-logo-light.png.asset.json";
import darkLogo from "@/assets/cente-logo-dark.jpg.asset.json";

export function Brand({ compact = false, onDark = false }: { compact?: boolean; onDark?: boolean }) {
  return <img src={(onDark ? darkLogo : lightLogo).url} alt="CENTE" className={compact ? "h-9 w-9 object-cover object-left" : "h-9 w-auto max-w-32 object-contain"} />;
}