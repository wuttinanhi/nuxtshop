import { ServiceKit } from "~/server/services/service.kit";

export default defineEventHandler(async (event) => {
  const serviceKit = ServiceKit.get();

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
  const id = parseInt(idparam);

  const body = await readBody(event);
  const { status } = body;

  const order = await serviceKit.orderService.updateOrderStatus(id, status);

  return order;
});