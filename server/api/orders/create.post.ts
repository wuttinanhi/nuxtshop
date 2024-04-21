import { AUTH_GUARD, getUserFromToken } from "~/server/impl/auth";
import { CartService } from "~/server/impl/cart.service";
import { OrderService } from "~/server/impl/order.service";

export default defineEventHandler(async (event) => {
  let token: string;
  try {
    token = await AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getUserFromToken(token);

  // get the cart for the user
  const cart = await CartService.getCart(user);

  // create an order from the cart
  await OrderService.createOrderFromCart(cart);

  return new Response("Order created", { status: 201 });
});
