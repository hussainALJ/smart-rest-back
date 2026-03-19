export const isCashier = (req, res, next) => {
  if (req.user.role !== "Cashier" && req.user.role !== "Admin") {
    const err = new Error("Access Denied: Cashier role required.");
    err.statusCode = 403;
    return next(err);
  }
  next();
}