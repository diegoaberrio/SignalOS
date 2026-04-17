export const errorMiddleware = (err, req, res, next) => {
  console.error("Global error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const errors = Array.isArray(err.errors) ? err.errors : [];

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};