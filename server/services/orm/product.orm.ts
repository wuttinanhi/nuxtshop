import type { IProductService } from "@/server/services/defs/product.service";
import type { IProduct } from "@/types/entity";
import { Op } from "sequelize";
import { DatabaseSingleton, Product, Stock } from "~/server/databases/database";

export class ProductServiceORM implements IProductService {
  init(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async createProduct(product: IProduct): Promise<IProduct> {
    const transaction = await DatabaseSingleton.getDatabase().transaction();

    try {
      const newProduct = await Product.create(
        {
          name: product.name,
          description: product.description,
          price: product.price,
          imageURL: product.imageURL,
        },
        { transaction }
      );
      await Stock.create(
        {
          productId: newProduct.id,
          quantity: 0,
        },
        { transaction }
      );

      await transaction.commit();

      return newProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      await transaction.rollback();
      throw error;
    }
  }

  public async getAll(): Promise<IProduct[]> {
    return Product.findAll({
      include: [
        {
          model: Stock,
          as: "stock",
        },
      ],
    });
  }

  public async getByID(id: number): Promise<IProduct | null> {
    return Product.findByPk(id);
  }

  public async deleteProduct(id: number): Promise<void> {
    const transaction = await DatabaseSingleton.getDatabase().transaction();

    try {
      await Product.destroy({ where: { id }, transaction });
      await Stock.destroy({ where: { productId: id }, transaction });
      await transaction.commit();
    } catch (error) {
      console.error("Error deleting product:", error);
      await transaction.rollback();
      throw error;
    }
  }

  public async updateProduct(id: number, product: IProduct): Promise<IProduct> {
    const transaction = await DatabaseSingleton.getDatabase().transaction();
    try {
      const dbProduct = await Product.findByPk(id, { transaction });
      if (!dbProduct) {
        throw new Error("Product not found");
      }

      dbProduct.name = product.name;
      dbProduct.description = product.description;
      dbProduct.price = product.price;
      dbProduct.imageURL = product.imageURL;

      if (product.stock) {
        const dbStock = await Stock.findOne({
          where: { productId: id },
          transaction,
        });
        if (!dbStock) {
          console.error("Stock not found for product:", id);
          throw new Error("Stock not found");
        }
        dbStock.quantity = product.stock;
        await dbStock.save({ transaction });
      }

      await dbProduct.save({ transaction });

      await transaction.commit();

      return product;
    } catch (error) {
      console.error("Error updating product:", error);
      await transaction.rollback();
      throw error;
    }
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
