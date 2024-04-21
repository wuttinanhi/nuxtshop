import { Cart, OrderItem, Product, User } from "~/types/general";

export class CartService {
  private static cart: Cart[] = [];

  public static async createCart(cart: Cart): Promise<Cart> {
    CartService.cart.push(cart);
    return cart;
  }

  public static async getCart(user: User): Promise<Cart> {
    const cart = CartService.cart.find((cart) => cart.user.id === user.id);
    if (!cart) {
      // create a new cart if it doesn't exist
      return CartService.createCart({
        user,
        products: [],
      });
    }
    return cart;
  }

  public static async addToCart(
    user: User,
    product: OrderItem
  ): Promise<Cart | undefined> {
    const cart = await CartService.getCart(user);

    // if the product is already in the cart, increase the quantity
    // otherwise, add the product to the cart
    const existingProduct = cart.products.find(
      (p) => p.product.id === product.product.id
    );
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ ...product, quantity: 1 });
    }

    return cart;
  }

  public static async removeFromCart(
    user: User,
    product: Product
  ): Promise<Cart | undefined> {
    // find the cart
    const cart = await CartService.getCart(user);

    // find the product in the cart
    const productIndex = cart.products.findIndex(
      (p) => p.product.id === product.id
    );
    if (productIndex === -1) {
      return cart;
    }

    // if the product quantity is more than 1, decrease the quantity
    // otherwise, remove the product from the cart
    const existingProduct = cart.products[productIndex];
    if (existingProduct.quantity > 1) {
      existingProduct.quantity--;
    } else {
      cart.products.splice(productIndex, 1);
    }

    return cart;
  }
}
