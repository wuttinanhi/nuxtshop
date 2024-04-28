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

  // const orders = await serviceKit.orderService.filterOrdersByStatus(
  //   "preparing"
  // );

  const orders = await serviceKit.orderService.getAllOrders();

  return orders;
});
