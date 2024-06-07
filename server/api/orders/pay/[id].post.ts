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

  const idparam = getRouterParam(event, "id");
  if (!idparam) {
    return new Response("Bad Request", { status: 400 });
  }

  // convert id to number
  const id = parseInt(idparam, 10);

  const order = await serviceKit.orderService.getOrder(id);
  if (!order) {
    return new Response("Order not Found", { status: 404 });
  }

  console.log(
    `User #${user.id} "${user.firstName} ${user.lastName}" is start paying for order ${order.id} (UUID: ${order.ref_uuid})`
  );

  const stripeSession = await serviceKit.payService.pay(order);

  return stripeSession;
});
