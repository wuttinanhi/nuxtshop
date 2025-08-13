import {IOrder} from "~/types/entity";
import {OrderStatus} from "#shared/enums/orderstatus.enum";
import {IServiceKit} from "~/server/services/defs/servicekit";

export async function checkOrderStatusWithStripeWrapper(serviceKit: IServiceKit<any>, order: IOrder) {
    // if order status is waiting for payment then check payment status from stripe
    if (order.status === OrderStatus.WaitForPayment) {
        console.log(`Checking payment status for order ${order.id} from stripe...`);

        // get order status from Stripe
        const stripePaymentIntent = await serviceKit.payService.getOrderStatus(
            order
        );

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
            console.log(`Payment status for order ${order.id} is null`);
        }
    }

    return order;
}