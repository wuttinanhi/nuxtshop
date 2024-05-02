import type { IProductService } from "@/server/services/defs/product.service";
import type { IProduct } from "@/types/entity";
import fs from "fs";
import { logger } from "nuxt/kit";
import { Op } from "sequelize";
import { DatabaseSingleton, Product } from "~/server/databases/database";

export class ProductServiceORM implements IProductService {
  public async init() {
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
        const newProduct = await Product.create(product, { transaction });
        console.log(`added product ${product.name}`);
      }

      transaction.commit();
    } catch (error) {
      console.error("Error loading products", error);
      transaction.rollback();
    }

    console.log("Products loaded");
  }

  constructor() {
    logger.info("ProductServiceORM initialized");

    // initialize the products
    this.init();
  }

  public async createProduct(product: IProduct): Promise<IProduct> {
    const newProduct = Product.build(product);
    return newProduct.save();
  }

  public async getAll(): Promise<IProduct[]> {
    return Product.findAll();
  }

  public async getByID(id: number): Promise<IProduct | null> {
    return Product.findByPk(id);
  }

  public async deleteProduct(id: number): Promise<void> {
    await Product.destroy({ where: { id } });
  }

  public async updateProduct(id: number, product: IProduct): Promise<IProduct> {
    const dbProduct = await this.getByID(id);
    if (!dbProduct) {
      throw new Error("Product not found");
    }

    dbProduct.name = product.name;
    dbProduct.description = product.description;
    dbProduct.price = product.price;
    dbProduct.imageURL = product.imageURL;

    await (dbProduct as Product).save();
    return product;
  }

  public async searchProducts(query: string): Promise<IProduct[]> {
    return Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`,
        },
        description: {
          [Op.iLike]: `%${query}%`,
        },
      },
    });
  }
}
