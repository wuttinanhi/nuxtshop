import {ServiceKit} from "~/server/services/service.kit";

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

    console.log(
        `User #${user.id} "${user.firstName} ${user.lastName}" is receiving order #${id}`
    );

    serviceKit.orderService.received(id);

    return user;
});
