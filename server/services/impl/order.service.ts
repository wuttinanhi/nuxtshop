import { Cart, Order, OrderStatus } from "~/types/general";
import { calculateTotalPrice } from "~/utils/basic";
import { IOrderService } from "../defs/order.service";

export class OrderService implements IOrderService {
  private static LATEST_ORDER_ID = 0;
  private static orders: Order[] = [];

  public async createOrderFromCart(cart: Cart): Promise<Order> {
    if (cart.products.length <= 0) {
      throw new Error("Cart is empty");
    }

    const order: Order = {
      id: ++OrderService.LATEST_ORDER_ID,
      user: cart.user,
      items: cart.products,
      status: "wait_for_payment",
      address: cart.user.address,
      totalPrice: calculateTotalPrice(cart.products),
    };
    OrderService.orders.push(order);
    return order;
  }

  public async getOrder(id: number): Promise<Order | undefined> {
    return OrderService.orders.find((order) => order.id === id);
  }

  public async payForOrder(id: number): Promise<Order> {
    const order = await this.getOrder(id);
    if (!order) {
      throw new Error("Order not found");
    }

    // move order status to next stage => preparing
    order.status = "preparing";
    return order;
  }

  public async getOrdersForUser(uid: number): Promise<Order[]> {
    return OrderService.orders.filter((order) => order.user.id === uid);
  }

  public async getAllOrders(): Promise<Order[]> {
    return OrderService.orders;
  }

  public async filterOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return OrderService.orders.filter((order) => order.status === status);
  }

  public async updateOrderStatus(
    id: number,
    status: OrderStatus
  ): Promise<Order> {
    const order = await this.getOrder(id);
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;
    return order;
  }
}
