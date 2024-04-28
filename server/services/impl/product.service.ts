import fs from "fs";
import { Product } from "~/types/general";
import { IProductService } from "../defs/product.service";

export class ProductService implements IProductService {
  private static products: Product[] = [];

  public async init() {
    console.log("Loading products");
    let rawdata = fs.readFileSync("./static/products.json", "utf8");
    ProductService.products = JSON.parse(rawdata);
    console.log("Products loaded");
  }

  public async createProduct(product: Product): Promise<Product> {
    ProductService.products.push(product);
    return product;
  }

  public async getAll(): Promise<Product[]> {
    if (ProductService.products.length <= 0) {
      await this.init();
    }
    return ProductService.products;
  }

  public async getByID(id: number): Promise<Product | undefined> {
    return ProductService.products.find((product) => product.id === id);
  }

  public async deleteProduct(id: number): Promise<void> {
    const index = ProductService.products.findIndex(
      (product) => product.id === id
    );
    if (index === -1) {
      return undefined;
    }
    ProductService.products.splice(index, 1)[0];
  }

  public async updateProduct(id: number, product: Product): Promise<Product> {
    const index = ProductService.products.findIndex(
      (product) => product.id === id
    );
    if (index === -1) {
      throw new Error("Product not found");
    }
    ProductService.products[index] = product;
    return product;
  }

  public async searchProducts(query: string): Promise<Product[]> {
    return ProductService.products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}