import { ServiceKit } from "~/server/services/service.kit";
import { validateTurnstileRequestWrapper } from "~/server/utils/turnstile";

export default defineEventHandler(async (event) => {
  const serviceKit = await ServiceKit.get();

  if (event.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await readBody(event);

  if (!body) {
    return new Response("Bad request", { status: 400 });
  }

  const { email, password, turnstileAnswer } = body;

  if (!email || !password) {
    return new Response("Bad request", { status: 400 });
  }

  // Validate turnstile answer
  await validateTurnstileRequestWrapper(turnstileAnswer);

  const token = await serviceKit.authService.login(email, password);
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid Login",
      data: { error: "Invalid Login" },
    });
  }

  return { token };
});
