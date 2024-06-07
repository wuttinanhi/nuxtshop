import { ServiceKit } from "../services/service.kit";

let isRunBefore = false;

export default defineNitroPlugin(() => {
  if (isRunBefore === true) {
    // console.log("Setup plugin already run before, skipping...");
    return;
  }
  isRunBefore = true;

  console.log("----- SETUP PLUGIN RUNNING -----");

  // triggering service kit for setup database
  ServiceKit.get();
});
