import jwt from "jsonwebtoken"
import "dotenv/config"

export const authenticate = (req, res, next) => {
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

    next();
  } catch (err) {
    next(err);
  }
}