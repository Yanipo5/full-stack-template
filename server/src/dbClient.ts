import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({ log: process.env.npm_lifecycle_script !== "jest" ? ["info", "warn", "error"] : ["warn", "error"] });
export type PrismaInstance = typeof prisma;

try {
  prisma.$connect(); // test connection is available
} catch (error) {
  console.error(error);
  process.exit(1);
}
