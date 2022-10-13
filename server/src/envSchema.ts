import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development"]),
  DATABASE_URL: z.string(),
  ADMIN_PASSWORD: z.string(),
  AUTHORIZATION_SIGNATURE: z.string(),
  SECURE_COOKIE: z.string()
});

export function getEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) throw result.error;
  return { ...result.data, SECURE_COOKIE: result.data.SECURE_COOKIE === "true" };
}
