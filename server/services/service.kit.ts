import type { IServiceKit } from "./defs/servicekit";
import { AuthServiceMock } from "./mock/auth.mock";
import { CartServiceMock } from "./mock/cart.mock";
import { OrderServiceMock } from "./mock/order.mock";
import { ProductServiceMock } from "./mock/product.mock";
import { AuthServiceORM } from "./orm/auth.orm";
import { ProductServiceORM } from "./orm/product.orm";

export class ServiceKit {
  private static servicekit: IServiceKit;

  public static initMock() {
    ServiceKit.servicekit = {
      authService: new AuthServiceMock(),
      cartService: new CartServiceMock(),
      orderService: new OrderServiceMock(),
      productService: new ProductServiceMock(),
    };
  }

  public static initORM() {
    const authService = new AuthServiceORM();
    ServiceKit.servicekit = {
      authService: authService,
      cartService: new CartServiceMock(),
      orderService: new OrderServiceMock(),
      productService: new ProductServiceORM(),
    };
  }

  public static get(): IServiceKit {
    if (!ServiceKit.servicekit) {
      // ServiceKit.initMock();
      ServiceKit.initORM();
    }
    return ServiceKit.servicekit;
  }
}
