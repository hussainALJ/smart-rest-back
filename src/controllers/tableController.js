import { catchAsync } from "../lib/catchAsync.js";
import { prisma } from "../lib/prisma.js";
import QRCode from "qrcode";

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

export const tablesPostController = catchAsync(async (req, res) => {
  const table = await prisma.tables.create({
    data: {
      qr_code_url: "",
      status: "Available",
    },
  });
 
  const menuUrl = `${process.env.FRONTEND_URL}/menu?table=${table.id}`;
  const qrCodeDataUrl = await QRCode.toDataURL(menuUrl);
 
  const updatedTable = await prisma.tables.update({
    where: { id: table.id },
    data: { qr_code_url: qrCodeDataUrl },
  });
 
  res.status(201).json({
    status: "success",
    data: { table: updatedTable },
  });
});

export const tablesDeleteController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
 
  try {
    const deletedItem =await prisma.tables.delete({ where: { id: Number(id) } });
    res.status(200).json({
      status: "success",
      message: `Table "${deletedItem.id}" has been deleted successfully`,
      data: { deletedItem },
    });  
  } catch (error) {
    if (error.code === "P2025") {
    const err = new Error("Table not found");
    err.statusCode = 404;
    return next(err);
    }
    
    if (error.code === "P2003") {
      const err = new Error("Cannot delete table: it has existing sessions");
      err.statusCode = 409;
      return next(err);
    }
    throw error;
  }
});