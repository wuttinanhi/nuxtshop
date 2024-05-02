import type { IProduct } from "@/types/entity";

export interface IProductService {
  init(): Promise<void>;
  createProduct(product: IProduct): Promise<IProduct>;
  getAll(): Promise<IProduct[]>;
  getByID(id: number): Promise<IProduct | null>;
  deleteProduct(id: number): Promise<void>;
  updateProduct(id: number, product: IProduct): Promise<IProduct>;
  searchProducts(query: string): Promise<IProduct[]>;
}
