const errorHandler = (err, req, res, next) => {
  console.error("Error detected:", err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: statusCode,
    message: err.message || "Internal server error"
  })
}

export default errorHandler