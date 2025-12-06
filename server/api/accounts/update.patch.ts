import { ServiceKit } from "~/server/services/service.kit";
import type { IUserInfo } from "~/types/entity";

export default defineEventHandler(async (event) => {
  const serviceKit = await ServiceKit.get();

  let token: string;
  try {
    token = await serviceKit.authService.AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await serviceKit.authService.getUserFromToken(token);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await readBody(event);

    if (!body) return new Response("Bad request", { status: 400 });

    const updateData = body as IUserInfo;
    updateData.id = user.id!;
    await serviceKit.userService.updateInfo(updateData);

    console.log(
      `User ${updateData.email} updated: ${updateData.firstName} ${updateData.lastName}`
    );
  } catch (error) {
    const e = error as Error;
    console.error("Error updating user:", e.name, e.message);
    return new Response(e.message, { status: 400 });
  }

  return new Response("User updated", { status: 200 });
});
