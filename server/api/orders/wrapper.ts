import { OrderStatus } from "#shared/enums/orderstatus.enum";
import type { IServiceKit } from "~/server/services/defs/servicekit";
import { slog } from "~/server/utils/slog";
import type { IOrder } from "~/types/entity";

export async function checkOrderStatusWithStripeWrapper(
  serviceKit: IServiceKit,
  order: IOrder
) {
  // if order status is waiting for payment then check payment status from stripe
  if (order.status === OrderStatus.WaitForPayment) {
    console.log(`Checking payment status for order ${order.id} from stripe...`);

    try {
      // get order status from Stripe
      const stripePaymentIntent =
        await serviceKit.payService.getPaymentIntentByOrder(order);

      if (stripePaymentIntent) {
        const status = stripePaymentIntent.status;

        console.log(`Payment status for order ${order.id} is ${status}`);

        // update order status if payment succeeded
        if (status === "succeeded") {
          const updatedOrder = await serviceKit.orderService.updateOrderStatus(
            order.id!,
            OrderStatus.Preparing
          );

          console.log(`Order ${order.id} status updated to Preparing`);

          return updatedOrder;
        }
      } else {
        slog(`stripePaymentIntent not found for order ${order.id}`);
      }
    } catch (error) {
      slog(`Error checking payment status for order ${order.id}: ${error}`);
    }
  }

  return order;
}
