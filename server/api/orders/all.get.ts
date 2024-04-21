import { AUTH_GUARD, getUserFromToken } from "~/server/impl/auth";
import { OrderService } from "~/server/impl/order.service";

export default defineEventHandler(async (event) => {
  let token: string;
  try {
    token = await AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getUserFromToken(token);

  const orders = await OrderService.getOrdersForUser(user.id);

  return orders;
});
