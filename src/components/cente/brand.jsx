export function Brand({ compact = false, onDark = false }) {
  return <img src={onDark ? "/logo-dark.jpg" : "/logo-light.png"} alt="CENTE" className={compact ? "h-9 w-9 object-cover object-left" : "h-9 w-auto max-w-32 object-contain"} />;
}
