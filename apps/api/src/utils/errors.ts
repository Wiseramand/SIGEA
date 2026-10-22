import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { env } from '../config/env';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado', details?: unknown) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Dados inválidos', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Autenticação necessária', details?: unknown) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acesso não autorizado ao recurso', details?: unknown) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

export function errorHandler(
  error: FastifyError | AppError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const requestId = request.id;

  // Erro de Validação Zod
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Falha de validação dos dados da requisição',
        details: error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
          rule: i.code
        })),
        requestId
      }
    });
  }

  // Erro de Aplicação Controlado
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        requestId
      }
    });
  }

  // Erros Nativos do Fastify (ex: 404, limites de payload)
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code || 'FASTIFY_ERROR',
        message: error.message,
        requestId
      }
    });
  }

  // Erro Não Tratado (500)
  request.log.error(
    { err: error, requestId },
    'Erro interno de servidor não tratado'
  );

  const isProduction = env.NODE_ENV === 'production';

  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ocorreu um erro interno. A equipa técnica foi notificada.',
      details: isProduction ? undefined : error.message,
      requestId
    }
  });
}
