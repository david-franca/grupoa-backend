import * as Joi from 'joi';

export interface EnvConfig {
  PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

export const validationSchema = Joi.object({
  PORT: Joi.number().port().default(3000),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
});
