export const validate = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse(req.body);
    req.validatedData = parsedData;
    next();
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues.map((issue) => ({
          field: issue.path.join(".") || "body",
          code: "VALIDATION_ERROR",
          message: issue.message,
        })),
      });
    }

    next(error);
  }
};