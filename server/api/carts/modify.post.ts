import { AUTH_GUARD, getUserFromToken } from "~/server/impl/auth";
import { CartService } from "~/server/impl/cart.service";
import { ProductService } from "~/server/impl/product.service";
import { CartModifyRequest } from "~/types/general";

export default defineEventHandler(async (event) => {
  let token: string;
  try {
    token = await AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getUserFromToken(token);

  const cart = await CartService.getCart(user);
  if (!cart) {
    return new Response("Cart not found", { status: 404 });
  }

  // read the cart modify request from the request body
  const modifyRequest: CartModifyRequest = await readBody(event);
  const { mode, productID, quantity } = modifyRequest;

  // find the product by ID
  const product = await ProductService.getByID(productID);
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }

  switch (mode) {
    case "add":
      // add the product to the cart
      await CartService.addToCart(user, { product: product, quantity: 1 });
      break;
    case "remove":
      // remove the product from the cart
      await CartService.removeFromCart(user, product);
      break;
    default:
      return new Response("Invalid modify mode", { status: 400 });
  }

  // get the updated cart
  const updatedCart = await CartService.getCart(user);

  return updatedCart;
});
