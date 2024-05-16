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

  const image = getFormDataValue(multipartFormData, "image", true);
  const name = getFormDataValue(multipartFormData, "name");
  const description = getFormDataValue(multipartFormData, "description");

  // parse price
  const priceRaw = getFormDataValue(multipartFormData, "price");
  const price = priceRaw ? parseFloat(priceRaw) : undefined;
  if (!price) {
    throw new Error("Price not found in request");
  }

  // generate image UUID
  const imageUUID = crypto.randomUUID();
  console.log(process.cwd() as string);

  // process.cwd() + /public/products/${imageUUID}.png
  const imagePath = path.join(
    process.cwd(),
    "public",
    "products",
    `${imageUUID}.png`
  );

  console.log("saving product image to", imagePath);

  await fs.writeFile(imagePath, image);

  const newProduct: IProduct = {
    id: 0,
    name,
    description,
    price: price,
    imageURL: `/products/${imageUUID}.png`,
  };

  const createdProduct = await serviceKit.productService.createProduct(
    newProduct
  );

  return createdProduct;
});

//   console.log(event.headers.get("content-type"));
//   trying to deal with multipart form data
//   for (const data of multipartFormData) {
//     // if image do not log to console
//     if (data.type?.includes("image")) {
//       console.log(data.name, data.type);
//       continue;
//     }
//     // convert data.data to a string
//     const name = data.name;
//     const value = new TextDecoder().decode(data.data);
//     console.log(name, data.type, value);
//   }
