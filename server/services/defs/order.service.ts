import type { ICart, IOrder, IUser, IUserRegister } from "@/types/entity";
import { OrderStatus } from "~/shared/enums/orderstatus.enum";

export interface IOrderFilter {
  user?: IUser;
  status?: OrderStatus;
}

export interface IOrderService {
  createOrderFromCart(cart: ICart): Promise<IOrder>;
  getOrder(id: number): Promise<IOrder | null>;
  payForOrder(id: number): Promise<IOrder>;
  getOrdersForUser(user: IUserRegister): Promise<IOrder[]>;
  getAllOrders(): Promise<IOrder[]>;
  filterOrdersByStatus(status: OrderStatus): Promise<IOrder[]>;
  filter(opts: IOrderFilter): Promise<IOrder[]>;
  updateOrderStatus(id: number, status: OrderStatus): Promise<IOrder>;
}
