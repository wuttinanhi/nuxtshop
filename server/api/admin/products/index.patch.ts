import { ServiceKit } from "@/server/services/service.kit";
import type { IProduct } from "@/types/entity";
import { getFormDataValue } from "@/utils/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export default defineEventHandler(async (event) => {
  const serviceKit = await ServiceKit.get();

  let token: string;
  try {
    token = await serviceKit.authService.AUTH_GUARD(event);
  } catch (_e) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await serviceKit.authService.getUserFromToken(token);

  const multipartFormData = await readMultipartFormData(event);
  if (!multipartFormData) {
    throw new Error("No multipart form data found");
  }

  const productIDRaw = getFormDataValue(multipartFormData, "id", false);
  if (!productIDRaw) {
    throw new Error("Product ID not found in request");
  }
  const productID = parseInt(productIDRaw, 10);

  const oldProduct = await serviceKit.productService.getByID(productID);
  if (!oldProduct) {
    throw new Error("Product not found in database");
  }

  let imageUUID: string | undefined = undefined;
  let imagePath: string | undefined = undefined;

  const image = getFormDataValue(multipartFormData, "image", true);
  if (image) {
    // generate image UUID
    const imageUUID = `SELFHOST_products-${crypto.randomUUID()}`;

    // build image path
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const imagePath = path.join(uploadDir, `${imageUUID}.png`);

    // save image to disk
    await fs.writeFile(imagePath, image);

    console.log("saving product image to", imagePath);
  }

  const name = getFormDataValue(multipartFormData, "name");
  const description = getFormDataValue(multipartFormData, "description");
  const priceRaw = getFormDataValue(multipartFormData, "price");
  const price = priceRaw ? parseFloat(priceRaw) : undefined;

  const newProduct: IProduct = {
    id: oldProduct.id,
    name: name || oldProduct.name,
    description: description || oldProduct.description,
    price: price || oldProduct.price,
    imageURL: image ? imageUUID : oldProduct.imageURL,
  };

  const updatedProduct = await serviceKit.productService.updateProduct(
    newProduct.id!,
    newProduct
  );

  return updatedProduct;
});
