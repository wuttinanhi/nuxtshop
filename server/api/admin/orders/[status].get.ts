import { ServiceKit } from "~/server/services/service.kit";
import { OrderStatusAdmin } from "~/types/general";

export default defineEventHandler(async (event) => {
  const serviceKit = ServiceKit.get();

  let token: string;
  try {
    token = await serviceKit.authService.AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await serviceKit.authService.getUserFromToken(token);

  const statusParam = getRouterParam(event, "status");
  if (!statusParam) {
    return new Response("Bad Request", { status: 400 });
  }
  const status = statusParam as OrderStatusAdmin;

  if (status === "all") {
    const orders = await serviceKit.orderService.getAllOrders();
    return orders;
  }

  const orders = await serviceKit.orderService.filterOrdersByStatus(status);
  return orders;
});
