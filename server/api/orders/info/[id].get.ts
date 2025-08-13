import {ServiceKit} from "~/server/services/service.kit";
import {OrderStatus} from "~/shared/enums/orderstatus.enum";

export default defineEventHandler(async (event) => {
    const serviceKit = await ServiceKit.get();

    let token: string;
    try {
        token = await serviceKit.authService.AUTH_GUARD(event);
    } catch (_e) {
        return new Response("Unauthorized", {status: 401});
    }

    const user = await serviceKit.authService.getUserFromToken(token);

    const idParam = getRouterParam(event, "id");
    if (!idParam) {
        return new Response("Bad Request", {status: 400});
    }

    // convert id to number
    const id = parseInt(idParam, 10);

    let order = await serviceKit.orderService.getOrder(id);
    if (!order) {
        return new Response("Order not Found", {status: 404});
    }

    // if user role is not admin and order is not belong to user then return unauthorized
    if (user.role !== "admin" && order.user.id !== user.id) {
        return new Response("Unauthorized", {status: 401});
    }

    // if order status is waiting for payment then check payment status from stripe
    if (order.status === OrderStatus.WaitForPayment) {
        console.log(`Checking payment status for order ${order.id} from stripe...`);

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
});
