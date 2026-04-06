import { prisma } from "../src/lib/prisma.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Seeding database...");
 
  // Create users
  const hashedPassword = await bcrypt.hash("admin123", 10);
 
  const users = [
    { username: "admin", password: hashedPassword, role: "Admin" },
    { username: "chef1", password: await bcrypt.hash("chef123", 10), role: "Chef" },
    { username: "waiter1", password: await bcrypt.hash("waiter123", 10), role: "Waiter" },
    { username: "cashier1", password: await bcrypt.hash("cashier123", 10), role: "Cashier" },
  ];
 
  for (const user of users) {
    await prisma.users.upsert({
      where: { username: user.username },
      update: {},
      create: user,
    });
  }
  console.log("Users created");
 
  // Create categories
  const categories = [
    { name: "مقبلات" },
    { name: "أطباق رئيسية" },
    { name: "مشروبات" },
    { name: "حلويات" },
  ];
 
  const createdCategories = [];
  for (const cat of categories) {
    const created = await prisma.categories.upsert({
      where: { id: (await prisma.categories.findFirst({ where: { name: cat.name } }))?.id || 0 },
      update: {},
      create: cat,
    });
    createdCategories.push(created);
  }
  console.log("Categories created");
 
  // Create sample menu items
  const [starters, mains, drinks, desserts] = createdCategories;
 
  const menuItems = [
    {
      category_id: starters.id,
      name: "حمص",
      description: "حمص طازج مع زيت الزيتون والبابريكا",
      price: 5000,
      image_url: "https://example.com/hummus.jpg",
      is_available: true,
    },
    {
      category_id: mains.id,
      name: "كباب مشوي",
      description: "كباب لحم مشوي مع الأرز والسلطة",
      price: 15000,
      image_url: "https://example.com/kebab.jpg",
      is_available: true,
    },
    {
      category_id: drinks.id,
      name: "عصير برتقال طازج",
      description: "عصير برتقال طبيعي طازج",
      price: 3000,
      image_url: "https://example.com/juice.jpg",
      is_available: true,
    },
    {
      category_id: desserts.id,
      name: "بقلاوة",
      description: "بقلاوة بالفستق والعسل",
      price: 4000,
      image_url: "https://example.com/baklava.jpg",
      is_available: true,
    },
  ];
 
  for (const item of menuItems) {
    const existing = await prisma.menuItems.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.menuItems.create({ data: item });
    }
  }
  console.log("Menu items created");
 
  // Create sample tables
  for (let i = 1; i <= 5; i++) {
    const existing = await prisma.tables.findFirst({ where: { id: i } });
    if (!existing) {
      await prisma.tables.create({
        data: {
          qr_code_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/menu?table=${i}`,
          status: "Available",
        },
      });
    }
  }
  console.log("Tables created");
 
  console.log("\n Seed complete!");
  console.log("   admin / admin123");
  console.log("   chef1 / chef123");
  console.log("   waiter1 / waiter123");
  console.log("   cashier1 / cashier123");
}
 
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());