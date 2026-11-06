import { loadEnv } from "./utils/env";

loadEnv();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-06',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      mockStripe: process.env.MOCK_STRIPE === "true",
      MOCK_STRIPE: process.env.MOCK_STRIPE,
    },
  },
  vite: {
    define: {
      "process.env.MOCK_STRIPE": JSON.stringify(process.env.MOCK_STRIPE),
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
        },
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
          tagPosition: "bodyClose",
        },
      ],
    },
  },
  css: ["@/assets/main.css"],
  plugins: ["@/server/init.ts"],
});
