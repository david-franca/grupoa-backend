import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Realiza o login e retorna um token JWT' }),
    ApiResponse({
      status: 200,
      description: 'Login bem-sucedido',
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...',
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Credenciais inválidas',
      example: {
        statusCode: 401,
        timestamp: '2025-10-29T18:54:57.819Z',
        path: '/auth/login',
        errors: ['Credenciais inválidas'],
      },
    }),
  );
}

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({
      summary: 'Registra um novo usuário e retorna um token JWT',
    }),
    ApiResponse({
      status: 201,
      description: 'Registro bem-sucedido',
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...',
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Dados de registro inválidos',
      example: {
        statusCode: 409,
        timestamp: '2025-10-29T18:56:35.547Z',
        path: '/auth/register',
        errors: ["Um usuário com o e-mail 'email@teste.com.br' já existe."],
      },
    }),
  );
}
