import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { storage } from '../../db';
import { comparePassword, generateToken } from '../../utils/auth';
import { createResponse } from '../../utils/response';
import { LoginRequest, LoginResponse } from '@shared/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    if (!event.body) {
      return createResponse(400, { success: false, error: { message: 'Request body is required' } });
    }

    const { username, password } = JSON.parse(event.body) as LoginRequest;
    
    // Validate input
    if (!username || !password) {
      return createResponse(400, { 
        success: false, 
        error: { message: 'Username and password are required' } 
      });
    }

    // Find user by username
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return createResponse(401, { 
        success: false, 
        error: { message: 'Invalid username or password' } 
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return createResponse(401, { 
        success: false, 
        error: { message: 'Invalid username or password' } 
      });
    }

    // Generate token and expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token valid for 7 days
    const token = generateToken();

    // Create session
    await storage.createSession(user.id, token, expiresAt);

    // Return user data and token
    const responseData: LoginResponse = {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      }
    };

    return createResponse(200, { success: true, data: responseData });
  } catch (error) {
    console.error('Login error:', error);
    return createResponse(500, { 
      success: false, 
      error: { message: 'Internal server error' } 
    });
  }
};
