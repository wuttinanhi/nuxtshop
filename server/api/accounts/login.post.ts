import { login } from "~/server/impl/auth";

export default defineEventHandler(async (event) => {
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

  const token = await login(email, password);

  return { token };
});
