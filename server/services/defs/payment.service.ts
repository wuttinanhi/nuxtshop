import type { IOrder } from "@/types/entity";
import Stripe from "stripe";

export interface IPaymentService {
  pay(order: IOrder): Promise<Stripe.Checkout.Session>;
  getPaymentIntentByOrder(order: IOrder): Promise<Stripe.PaymentIntent | null>;
  getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session>;
}
