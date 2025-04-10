import { ApiResponse } from '@shared/types';

/**
 * Create a standardized API Gateway response
 */
export const createResponse = (statusCode: number, body: ApiResponse): any => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  };
};
