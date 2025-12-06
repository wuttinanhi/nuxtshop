import { DatabaseSingleton } from "../server/databases/database";
import { ServiceKit } from "../server/services/service.kit";
import { MockWrapper } from "./mockwrapper";

export async function mock() {
  console.log("NODE_ENV =", process.env.NODE_ENV);

  try {
    await DatabaseSingleton.setupDatabase();
  } catch (error) {
    console.log("Error setting up database", error);
  }

  if (process.env.MOCK_DATA === "true") {
    console.log("Mocking data...");
    await MockWrapper.mockData(await ServiceKit.get());
    console.log("Mocking data done...");
  }
}
