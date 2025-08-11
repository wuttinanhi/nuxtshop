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
import {NitroApp} from "nitropack";
import {ServiceKit} from "~/server/services/service.kit";

export default async (_nitroApp: NitroApp) => {
    // Runs once when the server starts
    console.log('--------------------- Server setup complete')


    // Example: Initialize database connection, load config, etc.
    // await initializeDatabase().

    console.log("----- SETUP PLUGIN RUNNING (server/plugins/setup.ts) -----");

    // triggering service kit for setup database
    ServiceKit.get().then(r => {
        console.log("--- Setup complete");
    });
}
