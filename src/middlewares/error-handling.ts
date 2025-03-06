import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { ZodError } from 'zod';

export function errorHandling(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      status: 'error',
      message: 'Erro de validação',
      issues: error.issues,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}
