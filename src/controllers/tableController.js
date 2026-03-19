import { catchAsync } from "../lib/catchAsync.js";
import { prisma } from "../lib/prisma.js";

export const tablesGetController = catchAsync(async (req, res, next) => {
  const tables = await prisma.tables.findMany({
    orderBy: { id: "asc" },
    include: {
      sessions: {
        where: { status: "Active" },
        take: 1,
      },
    },
  });
 
  res.status(200).json({
    status: "success",
    data: { tables },
  });
})