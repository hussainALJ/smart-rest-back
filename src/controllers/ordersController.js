import { catchAsync } from "../lib/catchAsync.js";
import { prisma } from "../lib/prisma.js";

export const ordersPostController = catchAsync(async (req, res, next) => {
  const { session_id, items } = req.body;
 
  if (!session_id || !items || !Array.isArray(items) || items.length === 0) {
    const err = new Error("session_id and items array are required");
    err.statusCode = 400;
    return next(err);
  }
 
  const session = await prisma.sessions.findUnique({
    where: { id: Number(session_id) },
  });
 
  if (!session || session.status !== "Active") {
    const err = new Error("Session not found or already closed");
    err.statusCode = 404;
    return next(err);
  }
 
  const menuItemIds = items.map((i) => i.menu_item_id);
  const menuItems = await prisma.menuItems.findMany({
    where: { id: { in: menuItemIds } },
  });
 
  for (const item of items) {
    const menuItem = menuItems.find((m) => m.id === item.menu_item_id);
    if (!menuItem) {
      const err = new Error(`Menu item ${item.menu_item_id} not found`);
      err.statusCode = 404;
      return next(err);
    }
    if (!menuItem.is_available) {
      const err = new Error(`Menu item "${menuItem.name}" is currently unavailable`);
      err.statusCode = 400;
      return next(err);
    }
  }
 
  const order = await prisma.orders.create({
    data: {
      session_id: Number(session_id),
      status: "Pending",
      order_items: {
        create: items.map((item) => {
          const menuItem = menuItems.find((m) => m.id === item.menu_item_id);
          return {
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            notes: item.notes || null,
            price_at_time: menuItem.price,
          };
        }),
      },
    },
    include: {
      order_items: {
        include: { item: true },
      },
      session: {
        include: { table: true },
      },
    },
  });
 
  const io = req.app.get("io");
  if (io) {
    io.emit("newOrder", {
      order_id: order.id,
      table_id: order.session.table_id,
      table_number: order.session.table.id,
      items: order.order_items,
      created_at: order.created_at,
    });
  }
 
  res.status(201).json({
    status: "success",
    data: { order },
  });
});

export const ordersGetController = catchAsync(async (req, res) => {  
  const orders = await prisma.orders.findMany({
    include: {
      order_items: { include: { item: true } },
      session: { include: { table: true } },
    },
    orderBy: { created_at: "asc" },
  });
 
  res.status(200).json({
    status: "success",
    data: { orders },
  });
});

export const ordersStatusPutController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const { role } = req.user;
 
  const allowedTransitions = {
    Chef: ["Preparing", "Ready", "Canceled"],
    Waiter: ["Served"],
    Admin: ["Preparing", "Ready", "Served", "Canceled"],
  };
 
  const allowed = allowedTransitions[role] || [];
  if (!allowed.includes(status)) {
    const err = new Error(
      `Role "${role}" cannot set status to "${status}"`
    );
    err.statusCode = 403;
    return next(err);
  }
 
  try {
    const order = await prisma.orders.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        session: { include: { table: true } },
        order_items: { include: { item: true } },
      },
    });
 
    const io = req.app.get("io");
    if (io) {
      io.emit("statusUpdate", {
        order_id: order.id,
        status: order.status,
        session_id: order.session_id,
        table_id: order.session.table_id,
      });
    }
 
    res.status(200).json({
      status: "success",
      data: { order },
    });
  } catch (error) {
    if (error.code === "P2025") {
      const err = new Error("Order not found");
      err.statusCode = 404;
      return next(err);
    }
    throw error;
  }
});
