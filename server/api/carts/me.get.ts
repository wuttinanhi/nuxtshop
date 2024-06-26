import { ServiceKit } from "~/server/services/service.kit";

export default defineEventHandler(async (event) => {
  const serviceKit = await ServiceKit.get();

  let token: string;
  try {
    token = await serviceKit.authService.AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await serviceKit.authService.getUserFromToken(token);
  const userFromDB = await serviceKit.userService.findById(user.id!);
  if (!userFromDB) {
    return new Response("User not found", { status: 404 });
  }

  const cart = await serviceKit.cartService.getCart(userFromDB);
  if (!cart) {
    return new Response("Failed to get cart", { status: 500 });
  }

  return cart;
});
