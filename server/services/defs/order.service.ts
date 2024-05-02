import type { ICart, IOrder } from "@/types/entity";
import { OrderStatus } from "~/shared/enums/orderstatus.enum";

export interface IOrderService {
  createOrderFromCart(cart: ICart): Promise<IOrder>;
  getOrder(id: number): Promise<IOrder | undefined>;
  payForOrder(id: number): Promise<IOrder>;
  getOrdersForUser(uid: number): Promise<IOrder[]>;
  getAllOrders(): Promise<IOrder[]>;
  filterOrdersByStatus(status: OrderStatus): Promise<IOrder[]>;
  updateOrderStatus(id: number, status: OrderStatus): Promise<IOrder>;
}
