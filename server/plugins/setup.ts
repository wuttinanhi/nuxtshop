import url from "node:url";
import { loadEnv } from "~/utils/env";

// Ensure environment variables are loaded for Nitro server
loadEnv();

// Replace deprecated url.resolve to prevent Node DEP0169 warning from @mapbox/node-pre-gyp (used by bcrypt)
if (typeof url.resolve === "function") {
  url.resolve = (from: string, to: string): string => {
    try {
      return new URL(to, from).toString();
    } catch {
      return new URL(to, new URL(from, "http://localhost/")).pathname;
    }
  };
}

// Runs once when the server starts
export default defineNitroPlugin(async () => {
  console.log("----- 🚀  Server setup start -----");
  const { mock } = await import("~/mocks/mock");
  await mock();
  console.log("----- ✅ Server setup complete -----");
});
