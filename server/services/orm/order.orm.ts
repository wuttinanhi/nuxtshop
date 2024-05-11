import {
  Address,
  DatabaseSingleton,
  Order,
  OrderItem,
  Product,
  User,
} from "~/server/databases/database";
import { OrderStatus } from "~/shared/enums/orderstatus.enum";
import { ICart, IOrder, IUser } from "~/types/entity";
import { calculateTotalPrice } from "~/utils/basic";
import { IOrderFilter, IOrderService } from "../defs/order.service";

export class OrderServiceORM implements IOrderService {
  async createOrderFromCart(cart: ICart): Promise<IOrder> {
    if (cart.items.length <= 0) {
      throw new Error("Cart is empty");
    }

    const transaction = await DatabaseSingleton.getDatabase().transaction();

    try {
      const user = await User.findByPk(cart.userId, {
        include: Address,
      });
      if (!user) {
        throw new Error("User not found");
      }

      const address = await Address.findOne({
        where: { userId: user.id },
      });
      if (!address) {
        throw new Error("User address not found");
      }

      const order = await Order.create(
        {
          user: cart.user,
          status: OrderStatus.WaitForPayment,
          totalPrice: calculateTotalPrice(cart.items),
          UserId: user.id,
          AddressId: address.id,
          addressId: address.id,
        },
        { transaction }
      );

      for (const item of cart.items) {
        const orderItem = await OrderItem.create(
          {
            product: item.product,
            quantity: item.quantity,
            productId: item.product!.id,
            ProductId: item.product!.id,
            OrderId: order.id,
          },
          { transaction }
        );

        console.log(
          `added order item ${item.product!.name} to order #${order.id}`
        );
      }

      transaction.commit();

      console.log(`created order #${order.id} with status ${order.status}`);

      return order;
    } catch (error) {
      await transaction.rollback();
      console.log("Error creating order: " + error);
      throw new Error("Failed to create order");
    }
  }

  async getOrder(id: number): Promise<IOrder | null> {
    return Order.findByPk(id);
  }

  async payForOrder(id: number): Promise<IOrder> {
    const order = (await this.getOrder(id)) as Order;
    if (!order) {
      throw new Error("Order not found");
    }

    // update order status to preparing
    order.status = OrderStatus.Preparing;
    await order.save();

    return order;
  }

  async getOrdersForUser(user: IUser): Promise<IOrder[]> {
    return Order.findAll({
      where: { user: user },
    });
  }

  async getAllOrders(): Promise<IOrder[]> {
    return Order.findAll();
  }

  async filterOrdersByStatus(status: OrderStatus): Promise<IOrder[]> {
    return Order.findAll({
      where: { status: status },
    });
  }

  async filter(opts: IOrderFilter): Promise<IOrder[]> {
    let whereOpts = {} as any;

    if (opts.status) {
      whereOpts.status = opts.status;
    }

    if (opts.user) {
      whereOpts.userId = opts.user.id;
    }

    const orders = await Order.findAll({
      where: whereOpts,
      include: [
        { model: User },
        { model: Address, as: "address" },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
          as: "items",
        },
      ],
    });

    return orders;
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<IOrder> {
    const order = (await this.getOrder(id)) as Order;
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;
    await order.save();

    return order;
  }
}
