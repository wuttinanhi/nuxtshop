import { Cart, Order } from "~/types/general";
import { calculateTotalPrice } from "~/utils/basic";

export class OrderService {
  private static LATEST_ORDER_ID = 0;
  private static orders: Order[] = [];

  public static async createOrderFromCart(cart: Cart): Promise<Order> {
    const order: Order = {
      id: this.LATEST_ORDER_ID++,
      user: cart.user,
      items: cart.products,
      status: "wait_for_payment",
      address: cart.user.address,
      totalPrice: calculateTotalPrice(cart.products),
    };
    OrderService.orders.push(order);
    return order;
  }

  public static async getOrder(id: number): Promise<Order | undefined> {
    return OrderService.orders.find((order) => order.id === id);
  }

  public static async payForOrder(id: number): Promise<Order | undefined> {
    const order = await OrderService.getOrder(id);
    if (!order) {
      return undefined;
    }

    // move order status to next stage => preparing
    order.status = "preparing";
    return order;
  }

  public static async getOrdersForUser(uid: number): Promise<Order[]> {
    return OrderService.orders.filter((order) => order.user.id === uid);
  }

  public static async getAllOrders(): Promise<Order[]> {
    return OrderService.orders;
  }
}
