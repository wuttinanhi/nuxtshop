import type { IOrder } from "@/types/entity";

export interface IPaymentService<PAY_RETURN_TYPE> {
  pay(order: IOrder): Promise<PAY_RETURN_TYPE>;
  getOrderStatus(order: IOrder): Promise<any>;
}
