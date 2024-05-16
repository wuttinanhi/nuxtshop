import type { IProductService } from "@/server/services/defs/product.service";
import type { IProduct } from "@/types/entity";
import { Op } from "sequelize";
import { Product } from "~/server/databases/database";

export class ProductServiceORM implements IProductService {
  init(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public async createProduct(product: IProduct): Promise<IProduct> {
    const newProduct = Product.build({
      name: product.name,
      description: product.description,
      price: product.price,
      imageURL: product.imageURL,
    });
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
