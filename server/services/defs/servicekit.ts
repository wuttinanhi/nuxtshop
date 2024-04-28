import { IAuthService } from "./auth.service";
import { ICartService } from "./cart.service";
import { IOrderService } from "./order.service";
import { IProductService } from "./product.service";

export interface IServiceKit {
  authService: IAuthService;
  cartService: ICartService;
  orderService: IOrderService;
  productService: IProductService;
}
