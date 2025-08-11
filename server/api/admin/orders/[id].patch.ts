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

    if (!user || user.role !== "admin") {
        return new Response("Unauthorized", {status: 401});
    }
    
    const idParam = getRouterParam(event, "id");
    if (!idParam) {
        return new Response("Bad Request", {status: 400});
    }
    const id = parseInt(idParam);

    const body = await readBody(event);
    const {status} = body;

    const order = await serviceKit.orderService.updateOrderStatus(id, status);

    return order;
});
