import Stripe from "stripe";
import { IOrder } from "~/types/entity";
import { toStripeAmount } from "~/utils/basic";
import { IPaymentService } from "../defs/payment.service";

export class StripeService implements IPaymentService {
  protected static STRIPE_CURRENCY: string;
  private stripeInstance: Stripe;

  protected static getCurrency() {
    if (!this.STRIPE_CURRENCY) {
      this.STRIPE_CURRENCY = process.env.STRIPE_CURRENCY || "usd";
    }
    return this.STRIPE_CURRENCY;
  }

  async pay(order: IOrder): Promise<Stripe.Checkout.Session> {
    // convert to stripe No-cost orders
    // https://docs.stripe.com/payments/checkout/no-cost-orders
    const line_items: any = order.items.map((item) => ({
      price_data: {
        currency: StripeService.getCurrency(),
        unit_amount: toStripeAmount(item.product!.price),
        product_data: {
          name: item.product!.name,
        },
      },
      quantity: item.quantity,
    }));

    return this.getStripe().checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.PAY_SUCCESS_URL}/?order_id=${order.id}`,
      cancel_url: `${process.env.PAY_CANCEL_URL}/?order_id=${order.id}`,
      payment_intent_data: {
        metadata: {
          order_id: order.id!,
          ref_uuid: order.ref_uuid,
        },
      },
    });
  }

  async getCheckoutSession(
    sessionId: string
  ): Promise<Stripe.Checkout.Session> {
    return this.getStripe().checkout.sessions.retrieve(sessionId);
  }

  async getPaymentIntentByOrder(
    order: IOrder
  ): Promise<Stripe.PaymentIntent | null> {
    try {
      const paymentIntents = await this.getStripe().paymentIntents.search({
        query: `metadata[\'ref_uuid\']:\'${order.ref_uuid}\'`,
      });

      if (paymentIntents.data.length <= 0) {
        return null;
      }

      if (paymentIntents.data.length > 1) {
        throw new Error(`Multiple payment intents found for order ${order.id}`);
      }

      return paymentIntents.data[0];
    } catch (error) {
      if (error instanceof Stripe.errors.StripeAuthenticationError) {
        console.error("Stripe Authentication Error:", error.message);
        throw error;
      }

      // console log unknown errors
      console.error("Error retrieving payment intent from Stripe:", error);
      throw error;
    }
  }

  private getStripe() {
    if (!this.stripeInstance) {
      const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
      if (!STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY not set");
      }

      this.stripeInstance = new Stripe(STRIPE_SECRET_KEY);
    }

    return this.stripeInstance;
  }
}
