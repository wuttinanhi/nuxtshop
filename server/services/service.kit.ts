import fs from "fs";
import { UserRole } from "~/shared/enums/userrole.enum";
import { IAddress, IProduct } from "~/types/entity";
import { DatabaseSingleton, Product, User } from "../databases/database";
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

export class ServiceKit {
  private static isStartInit = false;
  private static servicekit: IServiceKit;

  public static async initMockService() {
    ServiceKit.servicekit = {
      authService: new AuthServiceMock(),
      cartService: new CartServiceMock(),
      orderService: new OrderServiceMock(),
      productService: new ProductServiceMock(),
      userService: new UserServiceMock(),
    };
  }

  public static async initORMService() {
    DatabaseSingleton.getDatabase();

    const authService = new AuthServiceORM();

    ServiceKit.servicekit = {
      authService: authService,
      cartService: new CartServiceORM(),
      orderService: new OrderServiceORM(),
      productService: new ProductServiceORM(),
      userService: new UserServiceORM(),
    };
  }

  public static async createAdminUser(svk: IServiceKit) {
    console.log("Checking for admin user");

    let adminUser = await User.findOne({
      where: { email: "admin@example.com" },
    });

    if (adminUser) return;

    console.log("Creating admin user");

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

  public static async createMockOrders() {
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

    console.log("Mock orders created");
  }

  public static async createMockProduct() {
    console.log("Loading products");
    let rawdata = fs.readFileSync(
      `${process.cwd()}/public/static/products.json`,
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
        console.log(`added product ${newProduct.name}`);
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
    const adminUser = await svk.userService.findByEmail("admin@example.com");

    if (!adminUser) {
      console.log("Admin user not found. Creating...");
      await ServiceKit.createAdminUser(svk);
    }
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

  public static async get(): Promise<IServiceKit> {
    if (!ServiceKit.servicekit && !ServiceKit.isStartInit) {
      ServiceKit.isStartInit = true;

      await this.setupDatabase();

      if (process.env.MOCK === "true") {
        console.log("USING MOCK SERVICE");
        await ServiceKit.initMockService();
      } else {
        await ServiceKit.initORMService();
      }

      await ServiceKit.checkAdminUser();

      if (process.env.NODE_ENV !== "production") {
        console.log("ENV is not production. Mocking...");
        await this.mockData();
      }
    }

    return ServiceKit.servicekit;
  }
}
