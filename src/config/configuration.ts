import * as Joi from 'joi';

export interface EnvConfig {
  PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
}

export const validationSchema = Joi.object({
  PORT: Joi.number().port().default(3000),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
});
