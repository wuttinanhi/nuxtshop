import {ServiceKit} from "~/server/services/service.kit";
import {OrderStatus} from "#shared/enums/orderstatus.enum";

// route for let user set order status from shipping to received
export default defineEventHandler(async (event) => {
    const serviceKit = await ServiceKit.get();

    let token: string;
    try {
        token = await serviceKit.authService.AUTH_GUARD(event);
    } catch (_e) {
        return new Response("Unauthorized", {status: 401});
    }

    const user = await serviceKit.authService.getUserFromToken(token);

    // parse order id from URL
    const idParam = getRouterParam(event, "id");
    if (!idParam) {
        return new Response("Bad Request", {status: 400});
    }
    const id = parseInt(idParam, 10);

    const order = await serviceKit.orderService.getOrder(id);
    if (!order) {
        return new Response("Order not found", {status: 404});
    }

    // check order belongs to user
    if (order.user.id !== user.id) {
        return new Response("Forbidden", {status: 403});
    }

    // order status must be Shipping
    if (order.status !== OrderStatus.Shipping) {
        throw new Error("Order must be shipping status");
    }

    await serviceKit.orderService.updateOrderStatus(order.id!, OrderStatus.Delivered);
    
    console.log(`User #${user.id} "${user.firstName} ${user.lastName}" is received order #${id}`);


    return user;
});
