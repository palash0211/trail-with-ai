import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { storage } from '../../db';
import { hashPassword, generateToken } from '../../utils/auth';
import { createResponse } from '../../utils/response';
import { RegisterRequest, LoginResponse } from '@shared/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    if (!event.body) {
      return createResponse(400, { success: false, error: { message: 'Request body is required' } });
    }

    const { username, email, password, firstName, lastName } = JSON.parse(event.body) as RegisterRequest;
    
    // Validate input
    if (!username || !email || !password) {
      return createResponse(400, { 
        success: false, 
        error: { message: 'Username, email, and password are required' } 
      });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return createResponse(409, { 
        success: false, 
        error: { message: 'Username already taken' } 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await storage.createUser({
      username,
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null
    });

    // Generate token and expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token valid for 7 days
    const token = generateToken();

    // Create session
    await storage.createSession(newUser.id, token, expiresAt);

    // Return user data and token
    const responseData: LoginResponse = {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName || undefined,
        lastName: newUser.lastName || undefined,
      }
    };

    return createResponse(201, { success: true, data: responseData });
  } catch (error) {
    console.error('Registration error:', error);
    return createResponse(500, { 
      success: false, 
      error: { message: 'Internal server error' } 
    });
  }
};
