import { body, validationResult } from 'express-validator';

export const registerValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

export const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ];
};

export const tradeValidationRules = () => {
  return [
    body('symbol').notEmpty().withMessage('Symbol is required').isString().withMessage('Symbol must be a string'),
    body('direction').isIn(['buy', 'sell']).withMessage('Direction must be either "buy" or "sell"'),
    body('size').isFloat({ gt: 0 }).withMessage('Size must be a positive number'),
    body('entryPrice').isFloat({ gt: 0 }).withMessage('Entry price must be a positive number'),
    body('exitPrice').optional().isFloat({ gt: 0 }).withMessage('Exit price must be a positive number'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
  ];
};

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
