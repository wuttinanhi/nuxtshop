import { Cart, OrderItem, Product, User } from "~/types/general";
import { ICartService } from "../defs/cart.service";

export class CartService implements ICartService {
  private static cart: Cart[] = [];

  public async createCart(cart: Cart): Promise<Cart> {
    CartService.cart.push(cart);
    return cart;
  }

  public async getCart(user: User): Promise<Cart> {
    const cart = CartService.cart.find((cart) => cart.user.id === user.id);
    if (!cart) {
      // create a new cart if it doesn't exist
      return this.createCart({ user, products: [] });
    }
    return cart;
  }

  public async addToCart(user: User, product: OrderItem): Promise<Cart> {
    const cart = await this.getCart(user);

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

  public async removeFromCart(user: User, product: Product): Promise<Cart> {
    // find the cart
    const cart = await this.getCart(user);

    // remove the product from the cart
    const productIndex = cart.products.findIndex(
      (p) => p.product.id === product.id
    );
    cart.products.splice(productIndex, 1);

    return cart;
  }

  public async setProductQuantity(
    user: User,
    product: Product,
    quantity: number
  ): Promise<Cart> {
    // find the cart
    const cart = await this.getCart(user);

    // find the product in the cart
    const existingProduct = cart.products.find(
      (p) => p.product.id === product.id
    );
    if (!existingProduct) {
      return cart;
    }

    // set the quantity
    existingProduct.quantity = quantity;

    // if the quantity is 0, remove the product from the cart
    if (quantity === 0) {
      const productIndex = cart.products.findIndex(
        (p) => p.product.id === product.id
      );
      cart.products.splice(productIndex, 1);
    }

    return cart;
  }

  public async clearCart(user: User): Promise<Cart> {
    // find the cart
    const cart = await this.getCart(user);
    // clear the cart
    cart.products = [];
    // return the updated cart
    return cart;
  }
}
