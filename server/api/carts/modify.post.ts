import { ServiceKit } from "~/server/services/service.kit";
import type { CartModifyRequest } from "~/types/general";

export default defineEventHandler(async (event) => {
  const serviceKit = ServiceKit.get();

  let token: string;
  try {
    token = await serviceKit.authService.AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await serviceKit.authService.getUserFromToken(token);

  const cart = await serviceKit.cartService.getCart(user);
  if (!cart) {
    return new Response("Cart not found", { status: 404 });
  }

  // read the cart modify request from the request body
  const modifyRequest: CartModifyRequest = await readBody(event);
  const { mode, productID, quantity } = modifyRequest;

  // find the product by ID
  const product = await serviceKit.productService.getByID(productID);
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }

  console.log(
    `Modifying cart for user ${user.id} with product ${product.id} (${mode})`
  );

  switch (mode) {
    case "add":
      // add the product to the cart
      await serviceKit.cartService.addToCart(user, {
        product: product,
        quantity: 1,
      });
      break;
    case "remove":
      // remove the product from the cart
      await serviceKit.cartService.removeFromCart(user, product);
      break;
    case "set":
      // set the product quantity in the cart
      await serviceKit.cartService.setProductQuantity(user, product, quantity);
      break;
    default:
      return new Response("Invalid modify mode", { status: 400 });
  }

  // get the updated cart
  const updatedCart = await serviceKit.cartService.getCart(user);

  return updatedCart;
});
