import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: "autoUpdate",
    injectRegister: null,
    devOptions: { enabled: false },
    filename: "sw.js",
    manifest: false,
    workbox: {
      navigateFallbackDenylist: [/^\/~oauth/],
      runtimeCaching: [
        { urlPattern: ({ request }) => request.mode === "navigate", handler: "NetworkFirst", options: { cacheName: "cente-pages", networkTimeoutSeconds: 4 } },
        { urlPattern: ({ url }) => url.origin === self.location.origin && /\.[a-f0-9]{8,}\./.test(url.pathname), handler: "CacheFirst", options: { cacheName: "cente-assets" } },
      ],
    },
  })],
  resolve: {
    alias: {
      "@": __dirname + "/src",
    },
  },
});
