import fs from "fs";
import {
  DatabaseSingleton,
  Order,
  Product,
  Stock,
} from "~/server/databases/database";
import { IProduct } from "~/types/entity";
import { IServiceKit } from "../defs/servicekit";
import { ServiceKit } from "../service.kit";

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

  public static async mockData(svk: IServiceKit<any>) {
    await this.createMockProduct();
    await this.createMockOrders();
  }
}
