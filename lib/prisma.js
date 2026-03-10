import "dotenv/config"

import { PrismaClient } from "@prisma/client/extension";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;

const neonPool = new Pool(connectionString);
const adapter = new PrismaNeon(neonPool);
export const prisma = new PrismaClient(adapter);