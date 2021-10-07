import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  datasources: { db: { url: process.env.POSTGRES_EXTERNAL_URL } },
});
