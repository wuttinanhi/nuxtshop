import { DatabaseSingleton } from "../databases/database";
import type { IServiceKit } from "./defs/servicekit";
import { AuthServiceMock } from "./mock/auth.mock";
import { CartServiceMock } from "./mock/cart.mock";
import { OrderServiceMock } from "./mock/order.mock";
import { ProductServiceMock } from "./mock/product.mock";
import { UserServiceMock } from "./mock/user.mock";
import { AuthServiceORM } from "./orm/auth.orm";
import { CartServiceORM } from "./orm/cart.orm";
import { OrderServiceORM } from "./orm/order.orm";
import { ProductServiceORM } from "./orm/product.orm";
import { UserServiceORM } from "./orm/user.orm";
import { StripeService } from "./payments/stripe.service";

export class ServiceKit {
  private static isStartInit = false;
  private static singleton: IServiceKit;

  public static async initMockService() {
    ServiceKit.singleton = {
      authService: new AuthServiceMock(),
      cartService: new CartServiceMock(),
      orderService: new OrderServiceMock(),
      productService: new ProductServiceMock(),
      userService: new UserServiceMock(),
      payService: new StripeService(),
    };
  }

  public static async initORMService() {
    DatabaseSingleton.getDatabase();

    const authService = new AuthServiceORM();
    const userService = new UserServiceORM();
    const cartService = new CartServiceORM(userService);
    const orderService = new OrderServiceORM();
    const productService = new ProductServiceORM();
    const stripeService = new StripeService();

    ServiceKit.singleton = {
      authService: authService,
      orderService: orderService,
      productService: productService,
      userService: userService,
      payService: stripeService,
      cartService: cartService,
    };
  }

  public static async get(): Promise<IServiceKit> {
    if (!ServiceKit.singleton && !ServiceKit.isStartInit) {
      ServiceKit.isStartInit = true;

      console.log("process.env.MOCK_SERVICE =", process.env.MOCK_SERVICE);

      if (process.env.MOCK_SERVICE === "true") {
        console.log("USING MOCK SERVICE");
        await ServiceKit.initMockService();
      } else {
        console.log("USING ORM SERVICE");
        await ServiceKit.initORMService();
      }
    }

    return ServiceKit.singleton;
  }
}
