import { ServiceKit } from "~/server/services/service.kit";

export default defineEventHandler(async (event) => {
  const serviceKit = ServiceKit.get();

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
  for (const product of cart.products) {
    console.log(product.product.id, product.product.name, product.quantity);
  }
  console.log("Total:", cart.products.length);

  return new Response("Order created", { status: 201 });
});
