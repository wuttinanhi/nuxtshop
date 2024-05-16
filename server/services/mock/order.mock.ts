import type { ICart, IOrder, IUser } from "@/types/entity";
import { OrderStatus } from "~/shared/enums/orderstatus.enum";
import { calculateTotalPrice } from "~/utils/basic";
import type { IOrderFilter, IOrderService } from "../defs/order.service";

export class OrderServiceMock implements IOrderService {
  private static LATEST_ORDER_ID = 0;
  private static orders: IOrder[] = [];

  public async createOrderFromCart(cart: ICart): Promise<IOrder> {
    if (cart.items.length <= 0) {
      throw new Error("Cart is empty");
    }

    const order: IOrder = {
      id: ++OrderServiceMock.LATEST_ORDER_ID,
      user: cart.user!,
      items: cart.items,
      status: OrderStatus.WaitForPayment,
      address: cart.user!.address!,
      totalPrice: calculateTotalPrice(cart.items),
      addressId: cart.user!.addressId,
    };

    OrderServiceMock.orders.push(order);
    return order;
  }

  public async getOrder(id: number): Promise<IOrder | null> {
    const order = OrderServiceMock.orders.find((order) => order.id === id);
    if (!order) return null;
    return order;
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

  public async getOrdersForUser(user: IUser): Promise<IOrder[]> {
    return OrderServiceMock.orders.filter((order) => order.user.id === user.id);
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

  public async filter(opts: IOrderFilter): Promise<IOrder[]> {
    return OrderServiceMock.orders.filter((order) => {
      if (opts.user && order.user.id !== opts.user.id) {
        return false;
      }

      if (opts.status && order.status !== opts.status) {
        return false;
      }

      return true;
    });
  }
}
