import { catchAsync } from "../lib/catchAsync.js";
import { prisma } from "../lib/prisma.js";

export const categoriesGetController = catchAsync(async (req, res) => {
  const categories = await prisma.categories.findMany({
    orderBy: { id: "asc" },
  });

  res.status(200).json({
    status: "success",
    data: { categories },
  });
});
