import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function ApiCreateStudent() {
  return applyDecorators(
    ApiOperation({ summary: 'Cria um novo aluno' }),
    ApiResponse({
      status: 201,
      description: 'Aluno criado com sucesso.',
      example: {
        ra: '26598',
        cpf: '12345678958',
        name: 'João da Silva',
        email: 'jsilva@escola.com.br',
        created_at: '2025-10-29T01:06:01.783Z',
        updated_at: '2025-10-29T01:06:01.783Z',
      },
    }),
    ApiResponse({
      status: 409,
      description: 'RA ou CPF já existe.',
      example: {
        statusCode: 409,
        timestamp: '2025-10-29T19:08:57.317Z',
        path: '/students',
        errors: ["Um aluno com o RA '12345' já existe."],
      },
    }),
  );
}

export function ApiFindAllStudents() {
  return applyDecorators(
    ApiOperation({ summary: 'Retorna todos os alunos paginados' }),
    ApiResponse({
      status: 200,
      description: 'Lista de alunos paginada retornada com sucesso.',
      example: {
        items: [
          {
            ra: '6597',
            cpf: '12345678985',
            name: 'João de Deus',
            email: 'jdeus@escola.com.br',
            created_at: '2025-10-28T23:50:40.550Z',
            updated_at: '2025-10-28T23:50:40.550Z',
          },
          {
            ra: '6598',
            cpf: '12345678965',
            name: 'Firmino da Silva',
            email: 'fsilva@escola.com.br',
            created_at: '2025-10-29T22:08:43.504Z',
            updated_at: '2025-10-29T22:08:43.504Z',
          },
        ],
        meta: {
          totalItems: 251,
          itemCount: 10,
          itemsPerPage: 10,
          totalPages: 26,
          currentPage: 1,
        },
        links: {
          first: '/students?limit=10',
          previous: '',
          next: '/students?page=2&limit=10',
          last: '/students?page=26&limit=10',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Parâmetros de paginação inválidos.',
      example: {
        statusCode: 400,
        timestamp: '2025-11-01T15:56:35.358Z',
        path: '/students?page=2',
        errors: [
          'O parâmetro "limit" é obrigatório.',
          'O parâmetro "limit" deve ser um número.',
        ],
      },
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Busca por RA, CPF, nome ou email',
    }),
    ApiQuery({
      name: 'page',
      required: true,
      default: 1,
      type: Number,
      description: 'Número da página',
    }),
    ApiQuery({
      name: 'limit',
      required: true,
      default: 10,
      type: Number,
      description: 'Quantidade de itens por página',
    }),
  );
}

export function ApiFindOneStudent() {
  return applyDecorators(
    ApiOperation({ summary: 'Retorna um aluno pelo RA' }),
    ApiResponse({
      status: 200,
      description: 'Aluno encontrado.',
      example: {
        ra: '6597',
        cpf: '12345678985',
        name: 'João de Deus',
        email: 'jdeus@escola.com.br',
        created_at: '2025-10-28T23:50:40.550Z',
        updated_at: '2025-10-28T23:50:40.550Z',
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Aluno não encontrado.',
      example: {
        statusCode: 404,
        timestamp: '2025-10-29T19:13:47.142Z',
        path: '/students/65978',
        errors: ['O recurso solicitado não foi encontrado.'],
      },
    }),
  );
}

export function ApiUpdateStudent() {
  return applyDecorators(
    ApiOperation({ summary: 'Atualiza um aluno pelo RA' }),
    ApiResponse({
      status: 200,
      description: 'Aluno atualizado com sucesso.',
      example: {
        ra: '6597',
        cpf: '12345678985',
        name: 'João de Jesus',
        email: 'jdeus@escola.com.br',
        created_at: '2025-10-28T23:50:40.550Z',
        updated_at: '2025-10-28T23:52:24.550Z',
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Aluno não encontrado.',
      example: {
        statusCode: 404,
        timestamp: '2025-10-29T19:13:47.142Z',
        path: '/students/65978',
        errors: ['O recurso solicitado não foi encontrado.'],
      },
    }),
  );
}

export function ApiRemoveStudent() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove um aluno pelo RA' }),
    ApiResponse({ status: 204, description: 'Aluno removido com sucesso.' }),
    ApiResponse({
      status: 404,
      description: 'Aluno não encontrado.',
      example: {
        statusCode: 404,
        timestamp: '2025-10-29T19:13:47.142Z',
        path: '/students/65978',
        errors: ['O recurso solicitado não foi encontrado.'],
      },
    }),
  );
}
