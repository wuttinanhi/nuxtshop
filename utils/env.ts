import fs from "node:fs";
import dotenv from "dotenv";

/**
 * Loads environment variables from the primary environment file if it exists,
 * otherwise falls back to the template environment file.
 *
 * @param envPath - File path to the primary environment file (defaults to ".env")
 * @param fallbackPath - File path to fallback environment file if primary is missing (defaults to "template.env")
 * @returns The dotenv configuration result
 *
 * @example
 * ```ts
 * import { loadEnv } from "../utils/env";
 *
 * // Loads .env if it exists, otherwise loads template.env
 * loadEnv();
 * ```
 */
export function loadEnv(
  envPath: string = ".env",
  fallbackPath: string = "template.env"
) {
  const targetPath = fs.existsSync(envPath) ? envPath : fallbackPath;
  return dotenv.config({ path: targetPath });
}

