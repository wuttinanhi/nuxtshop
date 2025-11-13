// let isRunBefore = false;
//
// export default defineNitroPlugin(() => {
//     if (isRunBefore) {
//         // console.log("Setup plugin already run before, skipping...");
//         return;
//     }
//     isRunBefore = true;
//
//     console.log("----- SETUP PLUGIN RUNNING (server/plugins/setup.ts) -----");
//
//     // triggering service kit for setup database
//     ServiceKit.get().then(r => {
//
//     });
// });

// server/plugins/setup.js
import { ServiceKit } from "~/server/services/service.kit";
import { DatabaseSingleton } from "../databases/database";
import { MockWrapper } from "../services/mock/mockwrapper";
import { UserSetup } from "../setups/users.setup";

// Runs once when the server starts

export default defineNitroPlugin(async (nitroApp) => {
  console.log("----- 🚀  Server setup start -----");

  console.log("NODE_ENV =", process.env.NODE_ENV);

  try {
    await DatabaseSingleton.setupDatabase();
  } catch (error) {
    console.log("Error setting up database", error);
  }

  await UserSetup.checkAdminUser();

  if (process.env.MOCK_DATA === "true") {
    console.log("Mocking data...");
    await MockWrapper.mockData(await ServiceKit.get());
    console.log("Mocking data done...");
  }

  console.log("----- ✅ Server setup complete -----");
});
