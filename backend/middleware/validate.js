/**
 * Generic Joi validation middleware
 * Usage: router.post('/route', validate(schema), controller)
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,   // return all errors at once
    stripUnknown: true,  // remove unknown fields
  });
  
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({
      success: false,
      message: messages,
      errors: error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      })),
    });
  }

  req.body = value; // replace with sanitized/validated value
  next();
};

module.exports = validate;
