import {ServiceKit} from "~/server/services/service.kit";
import {checkOrderStatusWithStripeWrapper} from "~/server/api/orders/wrapper";

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

    let orderChecked = await checkOrderStatusWithStripeWrapper(serviceKit, order);

    return orderChecked;
});
