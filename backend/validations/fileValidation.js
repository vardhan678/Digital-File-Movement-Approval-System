const Joi = require('joi');

const DEPARTMENTS = ['HR', 'Finance', 'IT', 'Operations', 'Legal', 'Procurement', 'Administration', 'Engineering'];
const CATEGORIES = ['Policy', 'Invoice', 'Contract', 'Report', 'Request', 'Complaint', 'Proposal', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const createFileSchema = Joi.object({
  title: Joi.string().trim().min(5).max(100).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 5 characters',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().trim().min(20).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 20 characters',
    'any.required': 'Description is required',
  }),
  department: Joi.string().valid(...DEPARTMENTS).required().messages({
    'any.only': `Department must be one of: ${DEPARTMENTS.join(', ')}`,
    'any.required': 'Department is required',
  }),
  category: Joi.string().valid(...CATEGORIES).required().messages({
    'any.only': `Category must be one of: ${CATEGORIES.join(', ')}`,
    'any.required': 'Category is required',
  }),
  priority: Joi.string().valid(...PRIORITIES).optional().default('Medium'),
});

const updateFileSchema = Joi.object({
  title: Joi.string().trim().min(5).max(100).optional(),
  description: Joi.string().trim().min(20).optional(),
  department: Joi.string().valid(...DEPARTMENTS).optional(),
  category: Joi.string().valid(...CATEGORIES).optional(),
  priority: Joi.string().valid(...PRIORITIES).optional(),
});

module.exports = { createFileSchema, updateFileSchema };
