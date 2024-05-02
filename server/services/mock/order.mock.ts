import type { ICart, IOrder } from "@/types/entity";
import { OrderStatus } from "~/shared/enums/orderstatus.enum";
import { calculateTotalPrice } from "~/utils/basic";
import type { IOrderService } from "../defs/order.service";

export class OrderServiceMock implements IOrderService {
  private static LATEST_ORDER_ID = 0;
  private static orders: IOrder[] = [];

  public async createOrderFromCart(cart: ICart): Promise<IOrder> {
    if (cart.products.length <= 0) {
      throw new Error("Cart is empty");
    }

    const order: IOrder = {
      id: ++OrderServiceMock.LATEST_ORDER_ID,
      user: cart.user,
      items: cart.products,
      status: OrderStatus.WaitForPayment,
      address: cart.user.address,
      totalPrice: calculateTotalPrice(cart.products),
    };
    OrderServiceMock.orders.push(order);
    return order;
  }

  public async getOrder(id: number): Promise<IOrder | undefined> {
    return OrderServiceMock.orders.find((order) => order.id === id);
  }

  public async payForOrder(id: number): Promise<IOrder> {
    const order = await this.getOrder(id);
    if (!order) {
      throw new Error("Order not found");
    }

    // move order status to next stage => preparing
    order.status = OrderStatus.Preparing;
    return order;
  }

  public async getOrdersForUser(uid: number): Promise<IOrder[]> {
    return OrderServiceMock.orders.filter((order) => order.user.id === uid);
  }

  public async getAllOrders(): Promise<IOrder[]> {
    return OrderServiceMock.orders;
  }

  public async filterOrdersByStatus(status: OrderStatus): Promise<IOrder[]> {
    return OrderServiceMock.orders.filter((order) => order.status === status);
  }

  public async updateOrderStatus(
    id: number,
    status: OrderStatus
  ): Promise<IOrder> {
    const order = await this.getOrder(id);
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;
    return order;
  }
}
