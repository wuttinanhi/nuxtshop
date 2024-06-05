import { ServiceKit } from "~/server/services/service.kit";
import { stringToOrderStatus } from "~/shared/enums/orderstatus.enum";

export default defineEventHandler(async (event) => {
  const serviceKit = await ServiceKit.get();

  let token: string;
  try {
    token = await serviceKit.authService.AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await serviceKit.authService.getUserFromToken(token);

  if (!user || user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const query = getQuery(event);
  if (!query.status) {
    return new Response("Missing status query parameter", { status: 400 });
  }
  const status = stringToOrderStatus(query.status as string);

  const orders = await serviceKit.orderService.filterOrdersByStatus(status);
  return orders;
});
