import { Product } from "~/types/entity";

export interface IProductService {
  init(): Promise<void>;
  createProduct(product: Product): Promise<Product>;
  getAll(): Promise<Product[]>;
  getByID(id: number): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
  updateProduct(id: number, product: Product): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;
}
