import { ServiceKit } from "~/server/services/service.kit";

export default defineEventHandler(async (event) => {
  const serviceKit = ServiceKit.get();
  const products = await serviceKit.productService.getAll();
  return products;
});
