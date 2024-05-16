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

  // get the cart for the user
  const cart = await serviceKit.cartService.getCart(user);

  // create an order from the cart
  await serviceKit.orderService.createOrderFromCart(cart);

  // clear the cart
  await serviceKit.cartService.clearCart(user);

  console.log("Order created");
  console.log(user.id, user.firstName, user.lastName);
  for (const item of cart.items) {
    const product = item.product!;
    console.log(product.id, product.name, item.quantity);
  }
  console.log("Total:", cart.items.length);

  return new Response("Order created", { status: 201 });
});
