import { ServiceKit } from "~/server/services/service.kit";

export default defineEventHandler(async (event) => {
  const serviceKit = await ServiceKit.get();

  let token: string;
  try {
    token = await serviceKit.authService.AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await serviceKit.authService.getUserFromToken(token);

  const idParam = getRouterParam(event, "id");
  if (!idParam) {
    return new Response("Bad Request", { status: 400 });
  }

  // convert id to number
  const id = parseInt(idParam, 10);

  const order = await serviceKit.orderService.getOrder(id);
  if (!order) {
    return new Response("Order not Found", { status: 404 });
  }

  console.log(
    `User #${user.id} "${user.firstName} ${user.lastName}" is start paying for order ${order.id} (UUID: ${order.ref_uuid})`
  );

  let stripeSession;
  if (order.stripe_checkout_session_id) {
    stripeSession = await serviceKit.payService.getCheckoutSession(
      order.stripe_checkout_session_id
    );

    console.log(
      `Existing Stripe Checkout Session found for Order #${order.id}: ${order.stripe_checkout_session_id}`
    );
  } else {
    stripeSession = await serviceKit.payService.pay(order);

    // update stripe checkout session id to order
    await serviceKit.orderService.updateStripeCheckoutSessionID(
      order.id!,
      stripeSession.id
    );

    console.log(
      `Creating New Stripe Checkout Session for Order #${order.id}: ${stripeSession.id}`
    );
  }

  return stripeSession;
});
