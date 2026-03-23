import { ValidationError } from '../utils/errors.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      throw new ValidationError(messages.join(', '));
    }

    req.body = value;
    next();
  };
};
