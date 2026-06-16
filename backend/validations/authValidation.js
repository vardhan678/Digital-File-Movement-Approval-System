const Joi = require('joi');

/**
 * Validation schema for user registration
 * Note: role is NOT accepted from client — always forced to 'employee' in controller
 */
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your password',
  }),
  department: Joi.string()
    .valid('HR', 'Finance', 'IT', 'Operations', 'Legal', 'Procurement', 'Administration', 'Engineering', 'General')
    .optional()
    .default('General'),
  // role field accepted but will be stripped/forced in controller
  role: Joi.string().optional(),
});

/**
 * Validation schema for user login
 */
const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});

module.exports = { registerSchema, loginSchema };
