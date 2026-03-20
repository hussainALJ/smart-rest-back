import { catchAsync } from "../lib/catchAsync.js";
import { prisma } from "../lib/prisma.js";

export const sessionStartController = catchAsync(async (req, res, next) => {
  const { table_id } = req.body;

  if (!table_id) {
    const err = new Error("table_id is required");
    err.statusCode = 400;
    return next(err);
  }

  const table = await prisma.tables.findUnique({
    where: { id: Number(table_id) },
  });

  if (!table) {
    const err = new Error("Table not found");
    err.statusCode = 404;
    return next(err);
  }

  const existingSession = await prisma.sessions.findFirst({
    where: { table_id: Number(table_id), status: "Active" },
  });

  if (existingSession) {
    return res.status(200).json({
      status: "success",
      message: "Rejoined existing session",
      data: { session: existingSession },
    });
  }

  const [session] = await prisma.$transaction([
    prisma.sessions.create({
      data: {
        table_id: Number(table_id),
        status: "Active",
      },
    }),
    prisma.tables.update({
      where: { id: Number(table_id) },
      data: { status: "Occupied" },
    }),
  ]);

  res.status(201).json({
    status: "success",
    message: "New session started",
    data: { session },
  });
});

export const sessionBillController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
 
  const session = await prisma.sessions.findUnique({
    where: { id: Number(id) },
    include: {
      table: true,
      orders: {
        where: { status: { not: "Canceled" } },
        include: {
          order_items: {
            include: { item: true },
          },
        },
      },
    },
  });
 
  if (!session) {
    const err = new Error("Session not found");
    err.statusCode = 404;
    return next(err);
  }
 
  const total = session.orders.reduce((sum, order) => {
    return (
      sum +
      order.order_items.reduce((s, oi) => s + oi.price_at_time * oi.quantity, 0)
    );
  }, 0);
 
  res.status(200).json({
    status: "success",
    data: {
      session: {
        id: session.id,
        table: session.table,
        status: session.status,
        created_at: session.created_at,
        orders: session.orders,
        total,
      },
    },
  });
});

export const sessionCheckoutController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
 
  const session = await prisma.sessions.findUnique({
    where: { id: Number(id) },
  });
 
  if (!session) {
    const err = new Error("Session not found");
    err.statusCode = 404;
    return next(err);
  }
 
  if (session.status === "Closed") {
    const err = new Error("Session is already closed");
    err.statusCode = 400;
    return next(err);
  }

    const blockingOrders = await prisma.orders.findMany({
    where: {
      session_id: Number(id),
      status: { notIn: ["Served", "Paid", "Canceled"] },
    },
  });

  if (blockingOrders.length > 0) {
    const err = new Error(
      "Cannot checkout — some orders are still pending, preparing, or ready. Please wait until all orders are served."
    );
    err.statusCode = 400;
    return next(err);
  }
 
  await prisma.$transaction([
    prisma.sessions.update({
      where: { id: Number(id) },
      data: { status: "Closed", closed_at: new Date() },
    }),
    prisma.tables.update({
      where: { id: session.table_id },
      data: { status: "Available" },
    }),
    prisma.orders.updateMany({
      where: {
        session_id: Number(id),
        status: { notIn: ["Canceled", "Paid"] },
      },
      data: { status: "Paid" },
    }),
  ]);
 
  res.status(200).json({
    status: "success",
    message: "Checkout complete. Table is now available.",
  });
});