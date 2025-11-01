import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiUnauthorized(source: string) {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
      example: {
        statusCode: 401,
        timestamp: '2025-10-29T19:07:17.849Z',
        path: `/${source}`,
        errors: ['Unauthorized'],
      },
    }),
  );
}
