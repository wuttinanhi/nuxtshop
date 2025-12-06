import dotenv from "dotenv";

async function main() {
  console.log("Start running mock...");

  dotenv.config({
    path: ".env",
  });

  const { mock } = await import("./mocks/mock");
  const { DatabaseSingleton } = await import("./server/databases/database");

  await DatabaseSingleton.resetDatabase();

  await mock();

  console.log("Mock done!");
}

main();
