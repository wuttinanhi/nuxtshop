import type { IProductService } from "@/server/services/defs/product.service";
import type { IProduct } from "@/types/entity";
import fs from "fs";

export class ProductServiceMock implements IProductService {
  private static LATEST_PRODUCT_ID: number = 0;

  private static products: IProduct[] = [];

  public async init() {
    console.log("Loading products");
    let rawdata = fs.readFileSync(
      `${process.cwd()}/public/static/products.json`,
      "utf8"
    );
    ProductServiceMock.products = JSON.parse(rawdata);

    // limit number of products to 3
    ProductServiceMock.products = ProductServiceMock.products.slice(0, 3);

    // set LATEST_PRODUCT_ID to the last product id
    ProductServiceMock.LATEST_PRODUCT_ID =
      ProductServiceMock.products[ProductServiceMock.products.length - 1].id;

    console.log("Products loaded");
  }

  public async createProduct(product: IProduct): Promise<IProduct> {
    product.id = ++ProductServiceMock.LATEST_PRODUCT_ID;
    ProductServiceMock.products.push(product);
    return product;
  }

  public async getAll(): Promise<IProduct[]> {
    if (ProductServiceMock.products.length <= 0) {
      await this.init();
    }
    return ProductServiceMock.products;
  }

  public async getByID(id: number): Promise<IProduct | null> {
    const result = ProductServiceMock.products.find(
      (product) => product.id === id
    );
    return result || null;
  }

  public async deleteProduct(id: number): Promise<void> {
    const index = ProductServiceMock.products.findIndex(
      (product) => product.id === id
    );
    if (index === -1) {
      return;
    }
    ProductServiceMock.products.splice(index, 1)[0];
  }

  public async updateProduct(id: number, product: IProduct): Promise<IProduct> {
    const index = ProductServiceMock.products.findIndex(
      (product) => product.id === id
    );
    if (index === -1) {
      throw new Error("Product not found");
    }
    ProductServiceMock.products[index] = product;
    return product;
  }

  public async searchProducts(query: string): Promise<IProduct[]> {
    return ProductServiceMock.products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
