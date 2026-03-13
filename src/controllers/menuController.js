import { catchAsync } from "../lib/catchAsync.js";
import { prisma } from "../lib/prisma.js";

export const menuPostController = catchAsync(async (req, res, next) => {
  const { category_id, name, description, price, image_url, is_available } = req.body;

  const newItem = await prisma.menuItems.create({
    data: {
      name,
      description,
      price: parseInt(price),
      image_url,
      is_available,
      category: {
        connect: {id: parseInt(category_id)}
      },
    },
    include: {
      category: true
    }
  })

  res.status(201).json({
    status: "success",
    data: { menuItem: newItem }
  })
})