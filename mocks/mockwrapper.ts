import fs from "fs";
import {
  DatabaseSingleton,
  Order,
  Product,
  Stock,
} from "~/server/databases/database";
import { UserRole } from "~/shared/enums/userrole.enum";
import type { IAddress, IProduct } from "~/types/entity";
import type { IServiceKit } from "../server/services/defs/servicekit";
import { ServiceKit } from "../server/services/service.kit";

export class MockWrapper {
  protected static async createMockOrders() {
    console.log("Creating mock orders...");

    const orderCount = await Order.count();
    if (orderCount > 0) {
      console.log("Orders table not empty. Skipping creating mock orders");
      return;
    }

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

  protected static async createMockProduct() {
    console.log("Creating mock products...");

    const productCount = await Product.count();
    if (productCount > 0) {
      console.log("Products table not empty. Skipping creating mock products");
      return;
    }

    console.log("Loading products from products.json");

    let rawData = fs.readFileSync(
      `${process.cwd()}/mocks/products.json`,
      "utf8"
    );

    // loop through the products and save them to the database
    const products: IProduct[] = JSON.parse(rawData);
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

      await transaction.commit();

      console.log("Products loaded");
    } catch (error) {
      console.error("Error loading products", error);
      await transaction.rollback();
    }
  }

  public static async mockData(svk: IServiceKit) {
    await this.createMockUsers();
    await this.createMockProduct();
    await this.createMockOrders();
  }

  public static async createMockUsers() {
    console.log("UserSetup->checkAdminUser: Checking for admin user");

    const serviceKit = await ServiceKit.get();

    let adminUser = await serviceKit.userService.findByEmail(
      "admin@example.com"
    );

    if (!adminUser) {
      console.log("Admin user not found. Creating...");

      const adminAddress: IAddress = {
        addressText: "123 Admin St",
        city: "Admin ville",
        state: "AD",
        zip: "12345",
      };

      await serviceKit.authService.register({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: "admin",
        role: UserRole.ADMIN,
        address: adminAddress,
      });

      const updatedAdminUser = await serviceKit.userService.findByEmail(
        "admin@example.com"
      );
      if (!updatedAdminUser) {
        throw new Error("Failed to update admin user role!");
      }

      await serviceKit.userService.setRole(updatedAdminUser, UserRole.ADMIN);

      console.log("Admin user created");
    }

    let user1 = await serviceKit.userService.findByEmail("user1@example.com");

    if (!user1) {
      console.log("User 1 not found. Creating...");

      const user1Address: IAddress = {
        addressText: "1 User St",
        city: "User City",
        state: "USER",
        zip: "12345",
      };

      await serviceKit.authService.register({
        firstName: "User",
        lastName: "One",
        email: "user1@example.com",
        password: "user1",
        role: UserRole.USER,
        address: user1Address,
      });

      console.log("User 1 created");
    }
  }
}
