// server/plugins/setup.js

import { mock } from "~/mocks/mock";

// Runs once when the server starts

export default defineNitroPlugin(async (nitroApp) => {
  console.log("----- 🚀  Server setup start -----");
  await mock();
  console.log("----- ✅ Server setup complete -----");
});
