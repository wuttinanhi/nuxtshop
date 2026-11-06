import { loadEnv } from "../utils/env";

async function main() {
  console.log("Start running mock...");

  loadEnv();

  const { mock } = await import("./mock");
  const { DatabaseSingleton } = await import("../server/databases/database");

  await DatabaseSingleton.resetDatabase();

  await mock();

  console.log("Mock done!");
}

main();
