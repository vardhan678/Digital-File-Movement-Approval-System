/**
 * validators.js — Plain JavaScript Form Validation
 *
 * No external library (no Zod, no Yup). All validation is done
 * with standard JS regex and conditional checks.
 *
 * Usage:
 *   const errors = validate({ name, email, password, confirmPassword });
 *   if (Object.keys(errors).length > 0) { /* show errors *\/ }
 */

// ─────────────────────────────────────────────
// Individual field validators
// ─────────────────────────────────────────────

/** Checks that a value is non-empty after trimming */
export const validateRequired = (value, label = 'This field') => {
  if (!value || String(value).trim() === '') {
    return `${label} is required`;
  }
  return null;
};

/** RFC 5322-compliant email regex */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Password rules:
 *  - Minimum 8 characters
 *  - At least one uppercase letter
 *  - At least one digit
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return null;
};

/** Ensures confirmPassword matches password */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

/** Validates minimum character length */
export const validateMinLength = (value, min, label = 'This field') => {
  if (!value || String(value).trim().length < min) {
    return `${label} must be at least ${min} characters`;
  }
  return null;
};

/** Validates maximum character length */
export const validateMaxLength = (value, max, label = 'This field') => {
  if (value && String(value).trim().length > max) {
    return `${label} cannot exceed ${max} characters`;
  }
  return null;
};

// /**
//  * Mobile number validation (10 digits, optionally prefixed with +91 or 0)
//  * Examples: 9876543210, +919876543210, 09876543210
//  */
// export const validateMobile = (mobile) => {
//   if (!mobile || mobile.trim() === '') return 'Mobile number is required';
//   const mobileRegex = /^(\+91|0)?[6-9]\d{9}$/;
//   if (!mobileRegex.test(mobile.replace(/\s/g, ''))) {
//     return 'Please enter a valid 10-digit mobile number';
//   }
//   return null;
// };

// ─────────────────────────────────────────────
// Composite validators for each form
// ─────────────────────────────────────────────

/**
 * Login form validation
 * @returns {Object} errors — empty object means valid
 */
export const validateLogin = ({ email, password }) => {
  const errors = {};
  const emailErr = validateEmail(email);
  const passwordErr = validateRequired(password, 'Password');
  if (emailErr) errors.email = emailErr;
  if (passwordErr) errors.password = passwordErr;
  return errors;
};

/**
 * Register form validation
 * @returns {Object} errors — empty object means valid
 */
export const validateRegister = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  const nameErr =
    validateRequired(name, 'Full name') ||
    validateMinLength(name, 2, 'Full name') ||
    validateMaxLength(name, 50, 'Full name');

  const emailErr = validateEmail(email);
  const passwordErr = validatePassword(password);
  const confirmErr = validateConfirmPassword(password, confirmPassword);

  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (passwordErr) errors.password = passwordErr;
  if (confirmErr) errors.confirmPassword = confirmErr;

  return errors;
};

/**
 * File request form validation
 * @returns {Object} errors — empty object means valid
 */
export const validateFileForm = ({ title, department, category }) => {
  const errors = {};

  const titleErr =
    validateRequired(title, 'Title') ||
    validateMinLength(title, 5, 'Title') ||
    validateMaxLength(title, 100, 'Title');

  const deptErr = validateRequired(department, 'Department');
  const catErr = validateRequired(category, 'Category');

  if (titleErr) errors.title = titleErr;
  if (deptErr) errors.department = deptErr;
  if (catErr) errors.category = catErr;

  return errors;
};
