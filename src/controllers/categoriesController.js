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

export const categoriesPostController = catchAsync(async (req, res) => {
  const { name } = req.body;
 
  const category = await prisma.categories.create({
    data: { name },
  });
 
  res.status(201).json({
    status: "success",
    data: { category },
  });
});
