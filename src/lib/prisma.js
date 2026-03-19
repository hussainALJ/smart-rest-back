import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });