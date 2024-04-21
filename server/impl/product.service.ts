import fs from "fs";
import { Product } from "~/types/general";

export class ProductService {
  private static products: Product[] = [];

  public static async init() {
    console.log("Loading products");
    let rawdata = fs.readFileSync("./static/products.json", "utf8");
    ProductService.products = JSON.parse(rawdata);
    console.log("Products loaded");
    return ProductService.products;
  }

  public static async createProduct(product: Product): Promise<Product> {
    ProductService.products.push(product);
    return product;
  }

  public static async getAll(): Promise<Product[]> {
    if (ProductService.products.length <= 0) {
      await ProductService.init();
    }
    return ProductService.products;
  }

  public static async getByID(id: number): Promise<Product | undefined> {
    return ProductService.products.find((product) => product.id === id);
  }

  public static async deleteProduct(id: number): Promise<Product | undefined> {
    const index = ProductService.products.findIndex(
      (product) => product.id === id
    );
    if (index === -1) {
      return undefined;
    }
    return ProductService.products.splice(index, 1)[0];
  }

  public static async updateProduct(
    id: number,
    product: Product
  ): Promise<Product | undefined> {
    const index = ProductService.products.findIndex(
      (product) => product.id === id
    );
    if (index === -1) {
      return undefined;
    }
    ProductService.products[index] = product;
    return product;
  }

  public static async searchProducts(query: string): Promise<Product[]> {
    return ProductService.products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
