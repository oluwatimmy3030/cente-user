let lastCapturedError = undefined;
const TTL_MS = 5000;

function record(error) {
  lastCapturedError = { error, at: Date.now() };
}

function describeStatus(error) {
  const { status, statusCode } = error;
  const value = status ?? statusCode;
  return typeof value === "number" ? ` (status ${value})` : "";
}

function safeStringify(value) {
  try { return JSON.stringify(value) ?? String(value); } catch { return String(value); }
}

const originalConsoleError = console.error.bind(console);
console.error = (...args) => {
  const expanded = args.map((arg) => {
    if (!(arg instanceof Error)) return arg;
    record(arg);
    const parts = [];
    let current = arg;
    for (let depth = 0; depth < 5 && current != null; depth++) {
      if (!(current instanceof Error)) { parts.push(typeof current === "string" ? current : safeStringify(current)); break; }
      const label = depth === 0 ? "" : "caused by: ";
      parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${describeStatus(current)}`);
      current = current.cause;
    }
    return parts.join("\n").slice(0, 8000);
  });
  originalConsoleError(...expanded);
};

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) => record((event).reason));
}

export function consumeLastCapturedError() {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) { lastCapturedError = undefined; return undefined; }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
