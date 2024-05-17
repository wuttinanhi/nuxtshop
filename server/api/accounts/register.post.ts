import { ServiceKit } from "~/server/services/service.kit";
import { IUserRegister } from "~/types/entity";

export default defineEventHandler(async (event) => {
  const serviceKit = await ServiceKit.get();

  if (event.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await readBody(event);

    if (!body) {
      return new Response("Bad request", { status: 400 });
    }

    const registeData = body as IUserRegister;
    await serviceKit.authService.register(registeData);

    console.log(
      `User registered: ${registeData.email} ${registeData.firstName} ${registeData.lastName}`
    );
  } catch (error) {
    const e = error as Error;

    if (e.name.includes("SequelizeUniqueConstraintError")) {
      return new Response("User already exists", { status: 400 });
    }

    console.error("Error registering user:", e.name, e.message);
    return new Response(e.message, { status: 400 });
  }

  return new Response("User registered", { status: 200 });
});
