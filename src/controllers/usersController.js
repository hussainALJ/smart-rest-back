import { catchAsync } from "../lib/catchAsync.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const usersGetController = catchAsync(async (req, res) => {
  const users = await prisma.users.findMany({
    orderBy: { id: "asc" },
    select: { id: true, username: true, role: true },
  });

  res.status(200).json({
    status: "success",
    data: { users },
  });
});

export const usersPostController = catchAsync(async (req, res, next) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: { username, password: hashedPassword, role },
    });

    res.status(201).json({
      status: "success",
      data: {
        user: { id: user.id, username: user.username, role: user.role },
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      const err = new Error("Username already exists");
      err.statusCode = 409;
      return next(err);
    }
    throw error;
  }
});

export const usersDeleteController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (Number(id) === req.user.userId) {
    const err = new Error("You cannot delete your own account");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const deletedUser = await prisma.users.delete({ where: { id: Number(id) } });

    res.status(200).json({
      status: "success",
      message: `User "${deletedUser.username}" has been deleted successfully`,
      data: { user: { id: deletedUser.id, username: deletedUser.username, role: deletedUser.role } },
    });
  } catch (error) {
    if (error.code === "P2025") {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }
    throw error;
  }
});