import { ServiceKit } from "~/server/services/service.kit";

export default defineEventHandler(async (event) => {
  const serviceKit = await ServiceKit.get();

  let token: string;
  try {
    token = await serviceKit.authService.AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userToken = await serviceKit.authService.getUserFromToken(token);
  if (!userToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  // find the user by id
  const user = await serviceKit.userService.findById(userToken.id!);
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  return user;
});
