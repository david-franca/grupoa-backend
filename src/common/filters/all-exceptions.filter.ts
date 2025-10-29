import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { DatabaseError } from 'pg';

function isPgError(error: unknown): error is QueryFailedError<DatabaseError> {
  return (
    error instanceof QueryFailedError &&
    (error as QueryFailedError<DatabaseError>).driverError instanceof
      DatabaseError
  );
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let messages: string[] = ['Ocorreu um erro interno no servidor.'];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        if (Array.isArray(response.message)) {
          messages = response.message as string[];
        } else if (typeof response.message === 'string') {
          messages = [response.message];
        } else if (typeof exception.message === 'string') {
          messages = [exception.message];
        }
      } else if (typeof response === 'string') {
        messages = [response];
      }
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      messages = ['O recurso solicitado não foi encontrado.'];
    } else if (isPgError(exception)) {
      status = HttpStatus.BAD_REQUEST;
      const { code } = exception.driverError;

      switch (code) {
        case '23505': // unique_violation
          status = HttpStatus.CONFLICT;
          messages = ['Recurso duplicado. Já existe no banco de dados.'];
          break;
        case '23503': // foreign_key_violation
          messages = ['Operação falhou devido a uma restrição de chave.'];
          break;
        case '23502': // not_null_violation
          messages = ['Um campo obrigatório está faltando.'];
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          messages = ['Erro inesperado no banco de dados.'];
      }
    } else {
      console.error('Erro desconhecido capturado pelo filtro:', exception);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      errors: messages,
    };

    res.status(status).json(errorResponse);
  }
}
