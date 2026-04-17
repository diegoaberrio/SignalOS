export const successResponse = ({
  res,
  statusCode = 200,
  message = "OK",
  data = null,
  meta = undefined,
}) => {
  const payload = {
    success: true,
    message,
  };

  if (data !== null) {
    payload.data = data;
  }

  if (meta !== undefined) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const errorResponse = ({
  res,
  statusCode = 500,
  message = "Internal server error",
  errors = [],
}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};