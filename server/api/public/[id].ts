import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  const idparam = getRouterParam(event, "id");
  if (!idparam) {
    return new Response("Bad Request", { status: 400 });
  }

  // if id is start with "SELFHOST_" then serve file at ${process.cwd()}/public/${idparam}
  if (idparam.startsWith("SELFHOST_")) {
    const filePath = `${process.cwd()}/public/uploads/${idparam}.png`;
    const fileBuffer = await fs.readFile(filePath);

    return new Response(fileBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  }

  // example: /public/favicon.ico
  const image = await fs.readFile(`${process.cwd()}/public/favicon.ico`);
  return new Response(image, {
    headers: {
      "Content-Type": "image/x-icon",
    },
  });
});
