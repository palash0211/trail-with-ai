// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  tokens: {
    idToken: string;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterResponse {
  user: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

// User Types
export interface GetUserResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profile?: {
    avatar?: string;
    bio?: string;
  };
}

// Lambda Event Types
export interface LambdaEvent {
  body?: string;
  pathParameters?: { [name: string]: string };
  queryStringParameters?: { [name: string]: string };
  headers?: { [name: string]: string };
  requestContext?: {
    authorizer?: {
      claims?: {
        sub: string;
        email: string;
        [key: string]: any;
      };
    };
  };
}

export interface LambdaResponse {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
    [key: string]: string | boolean;
  };
  body: string;
}
