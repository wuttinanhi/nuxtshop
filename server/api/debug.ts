export default defineEventHandler(async (event) => {
  return {
    cwd: process.cwd(),
    dirname: __dirname,
  };
});
