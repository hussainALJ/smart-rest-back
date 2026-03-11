import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaNeon } from "@prisma/adapter-neon";

import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
console.log("[prisma.js] connectionString=", connectionString);

const adapter = new PrismaNeon({ connectionString });
export const prisma = new PrismaClient({ adapter });