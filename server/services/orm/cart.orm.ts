import type { ICart, IOrderItem, IProduct, IUser } from "@/types/entity";
import {
  Address,
  Cart,
  OrderItem,
  Product,
  User,
} from "~/server/databases/database";
import type { ICartService } from "../defs/cart.service";

export class CartServiceORM implements ICartService {
  public async createCart(cart: ICart): Promise<ICart> {
    const newCart = await Cart.create({
      userId: cart.userId,
    });
    return newCart.save();
  }

  public async getCart(user: IUser): Promise<ICart> {
    const cart = await Cart.findOne({
      where: { userId: user.id },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
        {
          model: User,
          as: "user",
          include: [
            {
              model: Address,
              as: "address",
            },
          ],
        },
      ],
    });
    if (!cart) {
      // create a new cart if it doesn't exist
      return this.createCart({ user, userId: user.id!, items: [] });
    }
    return cart;
  }

  public async addToCart(user: IUser, orderItem: IOrderItem): Promise<ICart> {
    const cart = await this.getCart(user);

    // find order items where cartId is equal to cart.id and productId is equal to product.product.id
    const items = await OrderItem.findOne({
      where: { cartId: cart.id, productId: orderItem.productId },
    });

    // if the product is already in the cart, increment the quantity
    if (items) {
      items.quantity += orderItem.quantity;
      await items.save();
    } else {
      // if the product is not in the cart, add it to the cart
      const newOrderItems = await OrderItem.create({
        cartId: cart.id,
        productId: orderItem.productId,
        quantity: orderItem.quantity,
      });
      await newOrderItems.save();
    }

    return this.getCart(user);
  }

  public async removeFromCart(user: IUser, product: IProduct): Promise<ICart> {
    // find the cart
    const cart = await this.getCart(user);

    // find order items where cartId is equal to cart.id and productId is equal to product.product.id
    const items = await OrderItem.findOne({
      where: { cartId: cart.id, productId: product.id },
    });

    await items?.destroy();

    return cart;
  }

  public async setProductQuantity(
    user: IUser,
    product: IProduct,
    quantity: number
  ): Promise<ICart> {
    // find the cart
    const cart = await this.getCart(user);

    // find order items where cartId is equal to cart.id and productId is equal to product.product.id
    const items = await OrderItem.findOne({
      where: { cartId: cart.id, productId: product.id },
    });

    if (!items) {
      return cart;
    }

    // set the quantity
    if (quantity <= 0) {
      await this.removeFromCart(user, product);
      return cart;
    }

    items.quantity = quantity;
    await items.save();

    return cart;
  }

  public async clearCart(user: IUser): Promise<ICart> {
    await OrderItem.destroy({
      where: { cartId: user.id },
    });
    return this.getCart(user);
  }
}
