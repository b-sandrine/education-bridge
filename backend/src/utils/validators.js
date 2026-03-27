import Joi from 'joi';

export const validateEmail = (email) => {
  const schema = Joi.string().email().required();
  return schema.validate(email);
};

export const validatePassword = (password) => {
  const schema = Joi.string().min(8).required();
  return schema.validate(password);
};

export const userRegistrationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('student', 'educator', 'admin').default('student'),
  profilePicture: Joi.string().uri().optional(),
});

export const courseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  content: Joi.string().required(),
  durationWeeks: Joi.number().positive().required(),
});

export const lessonSchema = Joi.object({
  courseId: Joi.string().uuid().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  videoUrl: Joi.string().uri().optional(),
  video_url: Joi.string().uri().optional(),
  lessonOrder: Joi.number().positive().optional(),
  order: Joi.number().positive().optional(),
}).or('lessonOrder', 'order');

export const chatbotQuerySchema = Joi.object({
  message: Joi.string().required(),
  courseId: Joi.string().uuid().optional(),
  language: Joi.string().valid('en', 'fr', 'rw').default('en'),
});
