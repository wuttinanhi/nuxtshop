import { ServiceKit } from "~/server/services/service.kit";

let isRunBefore = false;

export default defineNuxtPlugin((nuxtApp) => {
  if (isRunBefore) {
    console.log("Setup plugin already run before, skipping...");
    return;
  }
  isRunBefore = true;

  console.log("--- SETUP PLUGIN ---");

  // triggering service kit for setup database
  ServiceKit.get();
});
