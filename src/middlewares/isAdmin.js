import jwt from "jsonwebtoken"
import "dotenv/config"

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") { 
    const err = new Error("Access Denied: You do not have administrative privileges.");
    err.statusCode = 403;
    return next(err);
  }

  next();
}