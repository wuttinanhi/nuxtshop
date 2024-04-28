import { ServiceKit } from "~/server/services/service.kit";

export default defineEventHandler(async (event) => {
  const serviceKit = ServiceKit.get();

  if (event.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await readBody(event);

  if (!body) {
    return new Response("Bad request", { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return new Response("Bad request", { status: 400 });
  }

  const token = await serviceKit.authService.login(email, password);

  return { token };
});
