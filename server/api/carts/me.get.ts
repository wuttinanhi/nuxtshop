import { AUTH_GUARD, getUserFromToken } from "~/server/impl/auth";
import { CartService } from "~/server/impl/cart.service";

export default defineEventHandler(async (event) => {
  let token: string;
  try {
    token = await AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getUserFromToken(token);

  const cart = await CartService.getCart(user);
  if (!cart) {
    return new Response("Failed to get cart", { status: 500 });
  }

  return cart;
});
