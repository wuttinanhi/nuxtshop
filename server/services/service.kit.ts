import { IServiceKit } from "./defs/servicekit";
import { AuthService } from "./impl/auth";
import { CartService } from "./impl/cart.service";
import { OrderService } from "./impl/order.service";
import { ProductService } from "./impl/product.service";

export class ServiceKit {
  private static servicekit: IServiceKit;

  public static init() {
    ServiceKit.servicekit = {
      authService: new AuthService(),
      cartService: new CartService(),
      orderService: new OrderService(),
      productService: new ProductService(),
    };
  }

  public static get(): IServiceKit {
    if (!ServiceKit.servicekit) {
      ServiceKit.init();
    }
    return ServiceKit.servicekit;
  }
}
