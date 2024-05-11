import { ServiceKit } from "~/server/services/service.kit";

export default defineEventHandler(async (event) => {
  const serviceKit = await ServiceKit.get();
  const products = await serviceKit.productService.getAll();
  return products;
});
