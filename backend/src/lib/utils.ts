import { LambdaResponse } from '../shared/types';

// Format Lambda response with consistent structure
export const formatResponse = (statusCode: number, body: any): LambdaResponse => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
};

// Handle errors in Lambda functions
export const handleError = (error: unknown): LambdaResponse => {
  console.error('Error:', error);
  
  let statusCode = 500;
  let errorMessage = 'Internal server error';
  
  if (error instanceof Error) {
    errorMessage = error.message;
    
    // Map specific error types to HTTP status codes
    if (error.name === 'ValidationError') {
      statusCode = 400;
    } else if (error.name === 'NotFoundError') {
      statusCode = 404;
    } else if (error.name === 'UnauthorizedError') {
      statusCode = 401;
    } else if (error.name === 'ForbiddenError') {
      statusCode = 403;
    }
  }
  
  return formatResponse(statusCode, {
    success: false,
    error: errorMessage,
  });
};

// Validate request body against schema
export const validateRequest = <T>(body: any, requiredFields: (keyof T)[]): { valid: boolean; error?: string } => {
  if (!body) {
    return { valid: false, error: 'Missing request body' };
  }
  
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return { valid: false, error: `Missing required field: ${String(field)}` };
    }
  }
  
  return { valid: true };
};
