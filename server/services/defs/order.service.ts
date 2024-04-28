import { Cart, Order } from "~/types/general";

export interface IOrderService {
  createOrderFromCart(cart: Cart): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  payForOrder(id: number): Promise<Order>;
  getOrdersForUser(uid: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
}
