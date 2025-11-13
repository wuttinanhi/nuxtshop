import { checkOrderStatusWithStripeWrapper } from "~/server/api/orders/wrapper";
import { ServiceKit } from "~/server/services/service.kit";
import {
  OrderStatus,
  stringToOrderStatus,
} from "~/shared/enums/orderstatus.enum";

export default defineEventHandler(async (event) => {
  const serviceKit = await ServiceKit.get();

  let token: string;
  try {
    token = await serviceKit.authService.AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }

  const query = getQuery(event);
  if (!query.status) {
    return new Response("Missing status query parameter", { status: 400 });
  }

  const user = await serviceKit.authService.getUserFromToken(token);

  // console.log("filtering orders by status =", query.status);
  // console.log("user =", user);

  const orderStatus = stringToOrderStatus(query.status as string);

  const orders = await serviceKit.orderService.filter({
    status: orderStatus,
    user,
  });

  const ordersChecked = await Promise.all(
    orders.map((order) => {
      if (order.status === OrderStatus.WaitForPayment) {
        return checkOrderStatusWithStripeWrapper(serviceKit, order);
      }
      return order;
    })
  );

  return ordersChecked;
});
