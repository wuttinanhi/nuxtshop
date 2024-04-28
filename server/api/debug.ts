export default defineEventHandler(async (event) => {
  return {
    cwd: process.cwd(),
    dirname: typeof __dirname !== "undefined" ? __dirname : null,
  };
});
