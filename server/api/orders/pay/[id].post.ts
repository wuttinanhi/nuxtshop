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

  const idparam = getRouterParam(event, "id");
  if (!idparam) {
    return new Response("Bad Request", { status: 400 });
  }

  // convert id to number
  const id = parseInt(idparam, 10);

  console.log(`User ${user.id} is paying for order ${id}`);

  OrderService.payForOrder(id);

  return user;
});
