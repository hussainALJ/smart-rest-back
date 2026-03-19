import { catchAsync } from "../lib/catchAsync.js";
import { prisma } from "../lib/prisma.js";
 
export const statsGetController = catchAsync(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
 
  // Daily sales total (from paid orders today)
  const todayOrderItems = await prisma.orderItems.findMany({
    where: {
      order: {
        status: { in: ["Paid"] },
        created_at: { gte: today, lt: tomorrow },
      },
    },
  });
 
  const dailySales = todayOrderItems.reduce(
    (sum, oi) => sum + oi.price_at_time * oi.quantity,
    0
  );
 
  // Most sold items (all time)
  const topItems = await prisma.orderItems.groupBy({
    by: ["menu_item_id"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });
 
  // Enrich with item names
  const itemIds = topItems.map((i) => i.menu_item_id);
  const menuItems = await prisma.menuItems.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, name: true, price: true },
  });
 
  const topItemsWithNames = topItems.map((ti) => ({
    menu_item: menuItems.find((m) => m.id === ti.menu_item_id),
    total_sold: ti._sum.quantity,
  }));
 
  // Active tables count
  const activeTables = await prisma.tables.count({
    where: { status: "Occupied" },
  });
 
  // Total orders today
  const todayOrdersCount = await prisma.orders.count({
    where: { created_at: { gte: today, lt: tomorrow } },
  });
 
  res.status(200).json({
    status: "success",
    data: {
      daily_sales: dailySales,
      today_orders: todayOrdersCount,
      active_tables: activeTables,
      top_items: topItemsWithNames,
    },
  });
});
