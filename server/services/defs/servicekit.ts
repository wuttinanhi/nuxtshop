import Stripe from "stripe";
import type { IAuthService } from "./auth.service";
import type { ICartService } from "./cart.service";
import type { IOrderService } from "./order.service";
import { IPaymentService } from "./payment.service";
import type { IProductService } from "./product.service";
import { IUserService } from "./user.service";

export interface IServiceKit<T = Stripe.Checkout.Session> {
  authService: IAuthService;
  cartService: ICartService;
  orderService: IOrderService;
  productService: IProductService;
  userService: IUserService;
  payService: IPaymentService<T>;
}
