import { catchAsync } from "../lib/catchAsync.js";
import { prisma } from "../lib/prisma.js";

export const menuGetController = catchAsync(async (req, res) => {
  const items = await prisma.menuItems.findMany({
    include: { category: true },
    orderBy: { id: "asc" },
  });

  res.status(200).json({
    status: "success",
    data: { menuItems: items },
  });
});

export const menuPostController = catchAsync(async (req, res, next) => {
  const { category_id, name, description, price, image_url, is_available } =
    req.body;

  try {
    const newItem = await prisma.menuItems.create({
      data: {
        name,
        description,
        price,
        image_url,
        is_available,
        category: {
          connect: { id: category_id },
        },
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: { menuItem: newItem },
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

export const menuPutController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { category_id, name, description, price, image_url, is_available } = req.body;
 
  try {
    const updated = await prisma.menuItems.update({
      where: { id: Number(id) },
      data: {
        ...(category_id && { category: { connect: { id: category_id } } }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(image_url !== undefined && { image_url }),
        ...(is_available !== undefined && { is_available }),
      },
      include: { category: true },
    });
 
    res.status(200).json({
      status: "success",
      data: { menuItem: updated },
    });
  } catch (error) {
    if (error.code === "P2025") {
      const err = new Error("Menu item not found");
      err.statusCode = 404;
      return next(err);
    }
    throw error;
  }
});