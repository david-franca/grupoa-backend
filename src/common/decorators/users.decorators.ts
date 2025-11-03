import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiFindAllUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'Retorna todos os usuários ativos' }),
    ApiResponse({
      status: 200,
      description: 'Lista de usuários retornada com sucesso.',
      example: [
        {
          id: 4,
          name: 'Jonas Mafra',
          email: 'jmafra@escola.com.br',
          isActive: true,
          role: 'admin',
        },
      ],
    }),
    ApiResponse({
      status: 403,
      description: 'Você não tem permissão para acessar este recurso.',
      example: {
        statusCode: 403,
        timestamp: '2025-11-03T03:24:02.097Z',
        path: '/users',
        errors: ['Você não tem permissão para acessar este recurso.'],
      },
    }),
  );
}

export function ApiFindOneUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Retorna um usuário pelo ID' }),
    ApiResponse({
      status: 200,
      description: 'Usuário encontrado.',
      example: {
        id: 4,
        name: 'Jonas Mafra',
        email: 'jmafra@escola.com.br',
        isActive: true,
        role: 'admin',
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado.',
      example: {
        statusCode: 404,
        timestamp: '2025-10-29T19:13:47.142Z',
        path: '/users/1',
        errors: ['O recurso solicitado não foi encontrado.'],
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Você não tem permissão para acessar este recurso.',
      example: {
        statusCode: 403,
        timestamp: '2025-11-03T03:24:02.097Z',
        path: '/users/4',
        errors: ['Você não tem permissão para acessar este recurso.'],
      },
    }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Atualiza um usuário pelo ID' }),
    ApiResponse({
      status: 200,
      description: 'Usuário atualizado com sucesso.',
    }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
    ApiResponse({
      status: 403,
      description: 'Você não tem permissão para acessar este recurso.',
      example: {
        statusCode: 403,
        timestamp: '2025-11-03T03:24:02.097Z',
        path: '/users/4',
        errors: ['Você não tem permissão para acessar este recurso.'],
      },
    }),
  );
}

export function ApiRemoveUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove um usuário pelo ID (inativação)' }),
    ApiResponse({ status: 204, description: 'Usuário removido com sucesso.' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
    ApiResponse({
      status: 403,
      description: 'Você não tem permissão para acessar este recurso.',
      example: {
        statusCode: 403,
        timestamp: '2025-11-03T03:24:02.097Z',
        path: '/users/4',
        errors: ['Você não tem permissão para acessar este recurso.'],
      },
    }),
  );
}

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Registra um novo usuário',
    }),
    ApiResponse({
      status: 201,
      description: 'Registro bem-sucedido',
      example: {
        id: 4,
        name: 'Jonas Mafra',
        email: 'jmafra@escola.com.br',
        isActive: true,
        role: 'admin',
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
    ApiResponse({
      status: 403,
      description: 'Você não tem permissão para acessar este recurso.',
      example: {
        statusCode: 403,
        timestamp: '2025-11-03T03:24:02.097Z',
        path: '/users',
        errors: ['Você não tem permissão para acessar este recurso.'],
      },
    }),
  );
}
