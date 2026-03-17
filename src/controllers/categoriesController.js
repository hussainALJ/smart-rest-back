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

export const categoriesDeleteController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
 
  try {
    const deletedItem = await prisma.categories.delete({ where: { id: Number(id) } });
    res.status(200).json({
      status: "success",
      message: `Category "${deletedItem.name}" has been deleted successfully`,
      data: { deletedItem },
    });
  } catch (error) {
    if (error.code === "P2025") {
      const err = new Error("Category not found");
      err.statusCode = 404;
      return next(err);
    }
    throw error;
  }
});
