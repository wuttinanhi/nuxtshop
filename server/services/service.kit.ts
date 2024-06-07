import fs from "fs";
import { UserRole } from "~/shared/enums/userrole.enum";
import { IAddress, IProduct } from "~/types/entity";
import {
  DatabaseSingleton,
  Order,
  Product,
  Stock,
  User,
} from "../databases/database";
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
  private static servicekit: IServiceKit<any>;

  public static async initMockService() {
    ServiceKit.servicekit = {
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

    ServiceKit.servicekit = {
      authService: authService,
      orderService: orderService,
      productService: productService,
      userService: userService,
      payService: stripeService,
      cartService: cartService,
    };
  }

  public static async createMockOrders() {
    const orderCount = await Order.count();
    if (orderCount > 0) {
      console.log("Orders table not empty. Skipping creating mock orders");
      return;
    }

    console.log("Creating mock orders...");

    const serviceKit = await ServiceKit.get();

    const user = await serviceKit.userService.findById(1);
    if (!user) {
      console.log("Failed to create mock orders: User to mock not found");
      return;
    }

    const product = await serviceKit.productService.getByID(1);
    if (!product) {
      console.log("Failed to create mock orders: Product to mock not found");
      return;
    }

    const cart = await serviceKit.cartService.addToCart(user, {
      product,
      quantity: 1,
      productId: product.id!,
    });

    await serviceKit.orderService.createOrderFromCart(cart);
    await serviceKit.cartService.clearCart(user);

    console.log("Mock orders created");
  }

  public static async createMockProduct() {
    const productCount = await Product.count();
    if (productCount > 0) {
      console.log("Products table not empty. Skipping creating mock products");
      return;
    }

    console.log("Loading products");

    let rawdata = fs.readFileSync(
      `${process.cwd()}/mocks/products.json`,
      "utf8"
    );

    // loop through the products and save them to the database
    const products: IProduct[] = JSON.parse(rawdata);
    const transaction = await DatabaseSingleton.getDatabase().transaction();

    try {
      for (const product of products) {
        const newProduct = await Product.create(
          {
            name: product.name,
            description: product.description,
            price: product.price,
            imageURL: product.imageURL,
          },
          { transaction }
        );
        const stock = await Stock.create(
          {
            productId: newProduct.id,
            quantity: product.stock,
          },
          { transaction }
        );

        console.log(
          `added product ${newProduct.name} (stock ${stock.quantity})`
        );
      }

      transaction.commit();
    } catch (error) {
      console.error("Error loading products", error);
      transaction.rollback();
    }

    console.log("Products loaded");
  }

  public static async mockData() {
    await ServiceKit.createMockProduct();
    await ServiceKit.createMockOrders();
  }

  public static async checkAdminUser() {
    const svk = await ServiceKit.get();
    console.log("Checking for admin user");

    let adminUser = await User.findOne({
      where: { email: "admin@example.com" },
    });

    if (adminUser) return;

    console.log("Admin user not found. Creating...");

    const adminAddress: IAddress = {
      addressText: "123 Admin St",
      city: "Adminville",
      state: "AD",
      zip: "12345",
    };
    await svk.authService.register({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: "admin-password",
      role: UserRole.ADMIN,
      address: adminAddress,
    });

    const updatedAdminUser = await svk.userService.findByEmail(
      "admin@example.com"
    );
    if (!updatedAdminUser) {
      console.log("Failed to get admin user");
      return;
    }

    await svk.userService.setRole(updatedAdminUser, UserRole.ADMIN);

    console.log("Admin user created");
  }

  public static async setupDatabase() {
    const db = DatabaseSingleton.getDatabase();
    await DatabaseSingleton.loadRelations();

    const tables = await db.getQueryInterface().showAllTables();
    console.log("Tables found in database: ", tables);

    if (tables.length <= 0) {
      console.log("No tables found. Syncing database...");
      await DatabaseSingleton.sync();
    }
  }

  public static async get(): Promise<IServiceKit<any>> {
    if (!ServiceKit.servicekit && !ServiceKit.isStartInit) {
      ServiceKit.isStartInit = true;

      try {
        await this.setupDatabase();
      } catch (error) {
        console.log("Error setting up database", error);
      }

      if (process.env.MOCK_SERVICE === "true") {
        console.log("USING MOCK SERVICE");
        await ServiceKit.initMockService();
      } else {
        await ServiceKit.initORMService();
      }

      await ServiceKit.checkAdminUser();

      console.log("NODE_ENV =", process.env.NODE_ENV);
      if (process.env.MOCK_DATA === "true") {
        console.log("Mocking Data...");
        await this.mockData();
      }
    }

    return ServiceKit.servicekit;
  }
}
