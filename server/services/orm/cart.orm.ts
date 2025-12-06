import type { ICart, IOrderItem, IProduct, IUser } from "@/types/entity";
import { Transaction } from "sequelize";
import {
  Address,
  Cart,
  DatabaseSingleton,
  OrderItem,
  Product,
  Stock,
  User,
} from "~/server/databases/database";
import type { ICartService } from "../defs/cart.service";
import type { IUserService } from "../defs/user.service";

export class CartServiceORM implements ICartService {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  public async createCart(cart: ICart): Promise<ICart> {
    // find the user by id
    const user = await this.userService.findById(cart.userId);
    if (!user) {
      throw new Error("User not found when creating cart");
    }

    const newCart = await Cart.create({
      userId: cart.userId,
    });
    return newCart.save();
  }

  public async getCart(user: IUser, transaction?: Transaction): Promise<ICart> {
    const cart = await Cart.findOne({
      where: { userId: user.id },
      transaction,
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
    const transaction = await DatabaseSingleton.getDatabase().transaction();

    try {
      const cart = await this.getCart(user, transaction);

      // get product data
      const product = await Product.findOne({
        where: { id: orderItem.productId },
        transaction,
      });
      if (!product) {
        throw new Error(`Product #${orderItem.productId} not found`);
      }

      // check stock quantity
      const stock = await Stock.findOne({
        where: { productId: product.id },
        transaction,
      });
      if (!stock) {
        throw new Error(
          `Product #${product.id} ${product.name} stock not found`
        );
      }

      if (stock.quantity < orderItem.quantity) {
        throw new Error(
          `Not enough stock for product #${product.id} ${product.name}`
        );
      }

      // find order items where cartId is equal to cart.id and productId is equal to product.product.id
      const items = await OrderItem.findOne({
        where: { cartId: cart.id, productId: product.id },
        transaction,
      });

      // if the product is already in the cart, increment the quantity
      if (items) {
        items.quantity += orderItem.quantity;
        await items.save({ transaction });
      } else {
        // if the product is not in the cart, add it to the cart
        const newOrderItems = await OrderItem.create({
          cartId: cart.id,
          productId: product.id,
          quantity: orderItem.quantity,
          transaction,
        });
        await newOrderItems.save({ transaction });
      }

      await transaction.commit();

      return this.getCart(user);
    } catch (error) {
      console.error("Error add to cart", error);
      await transaction.rollback();
      throw error;
    }
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
