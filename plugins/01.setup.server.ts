import { ServiceKit } from "~/server/services/service.kit";

let isRunBefore = false;
export default defineNuxtPlugin((nuxtApp) => {
  if (isRunBefore) {
    return;
  }
  isRunBefore = true;

  console.log("--- SETUP PLUGIN ---");

  // triggering service kit for setup database
  ServiceKit.get();
});
