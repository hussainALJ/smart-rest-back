import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
  console.error("Error detected:", err.stack);

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "Bad request",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        status: e.code,
        message: e.message,
      })),
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: statusCode,
    message: err.message || "Internal server error",
  });
};

export default errorHandler;
