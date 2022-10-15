import { z } from "zod";
import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../../.env` });

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development"]),
  DATABASE_URL: z.string(),
  ADMIN_PASSWORD: z.string(),
  AUTHORIZATION_SIGNATURE: z.string(),
  SECURE_COOKIE: z.string()
});

export const env = (() => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) throw result.error;
  return { ...result.data, SECURE_COOKIE: result.data.SECURE_COOKIE === "true" };
})();
