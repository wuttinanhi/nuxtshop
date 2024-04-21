import { ProductService } from "~/server/impl/product.service";

export default defineEventHandler(async (event) => {
  const products = await ProductService.getAll();
  return products;
});
