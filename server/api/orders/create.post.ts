import { ServiceKit } from "~/server/services/service.kit";
import { calculateTotalPrice } from "~/utils/basic";

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

  console.log("========== Order created ==========");
  console.log(
    `Buyer: #${user.id} ${user.email} ${user.firstName} ${user.lastName}`
  );
  for (const item of cart.items) {
    const product = item.product!;
    console.log(
      ` - ${product.name} x ${item.quantity} = $${Number(
        product.price * item.quantity
      ).toFixed(2)}`
    );
  }
  console.log("Total items:", cart.items.length);
  console.log("Total price:", calculateTotalPrice(cart.items));
  console.log("====================================");

  // create an order from the cart
  const createdOrder = await serviceKit.orderService.createOrderFromCart(cart);

  // clear the cart
  await serviceKit.cartService.clearCart(user);

  return createdOrder;
});
