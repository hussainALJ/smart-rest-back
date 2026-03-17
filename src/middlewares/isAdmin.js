import jwt from "jsonwebtoken"
import "dotenv/config"

export const isAdmin = (req, res, next) => {
  try {
    const auth = req.headers["authorization"];
    const token = auth && auth.split(" ")[1];

    if(!token) {
      const err = new Error("Access denied. No token provided.");
      err.statusCode = 401;
      return next(err);
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    if (user.role !== "Admin") { 
      const err = new Error("Access Denied: You do not have administrative privileges.");
      err.statusCode = 403;
      return next(err);
    }

    next();
  } catch (err) {
    next(err);
  }
}