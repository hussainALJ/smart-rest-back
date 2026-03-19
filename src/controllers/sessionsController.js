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
