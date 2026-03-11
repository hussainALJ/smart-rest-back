import { prisma } from "../src/lib/prisma.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error(
      "ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment variables",
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.users.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password: hashedPassword,
      role: "Admin",
    },
  });

  console.log("Seed successful: Created/Updated Admin", admin.username);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Cleaning up connections...");
    await prisma.$disconnect();
    process.exit(0);
  });
