import type { ICart, IOrderItem, IProduct, IUser } from "@/types/entity";
import type { ICartService } from "../defs/cart.service";

export class CartServiceMock implements ICartService {
  private static cart: ICart[] = [];

  public async createCart(cart: ICart): Promise<ICart> {
    CartServiceMock.cart.push(cart);
    return cart;
  }

  public async getCart(user: IUser): Promise<ICart> {
    const cart = CartServiceMock.cart.find((cart) => cart.userId === user.id);
    if (!cart) {
      // create a new cart if it doesn't exist
      return this.createCart({ user, items: [], userId: user.id! });
    }
    return cart;
  }

  public async addToCart(user: IUser, product: IOrderItem): Promise<ICart> {
    const cart = await this.getCart(user);

    // if the product is already in the cart, increase the quantity
    // otherwise, add the product to the cart
    const existingProduct = cart.items.find(
      (p) => p.product!.id === product.product!.id
    );

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.items.push({ ...product, quantity: 1 });
    }

    return cart;
  }

  public async removeFromCart(user: IUser, product: IProduct): Promise<ICart> {
    // find the cart
    const cart = await this.getCart(user);

    // remove the product from the cart
    const productIndex = cart.items.findIndex(
      (p) => p.product!.id === product.id
    );
    cart.items.splice(productIndex, 1);

    return cart;
  }

  public async setProductQuantity(
    user: IUser,
    product: IProduct,
    quantity: number
  ): Promise<ICart> {
    // find the cart
    const cart = await this.getCart(user);

    // find the product in the cart
    const existingProduct = cart.items.find(
      (p) => p.product!.id === product.id
    );
    if (!existingProduct) {
      return cart;
    }

    // set the quantity
    existingProduct.quantity = quantity;

    // if the quantity is 0, remove the product from the cart
    if (quantity === 0) {
      const productIndex = cart.items.findIndex(
        (p) => p.product!.id === product.id
      );
      cart.items.splice(productIndex, 1);
    }

    return cart;
  }

  public async clearCart(user: IUser): Promise<ICart> {
    // find the cart
    const cart = await this.getCart(user);
    // clear the cart
    cart.items = [];
    // return the updated cart
    return cart;
  }
}
