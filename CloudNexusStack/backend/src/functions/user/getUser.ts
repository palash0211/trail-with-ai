import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { storage } from '../../db';
import { verifyAuth } from '../../utils/auth';
import { createResponse } from '../../utils/response';
import { UserProfile } from '@shared/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Verify authentication
    const authResult = await verifyAuth(event.headers.Authorization || '');
    if (!authResult.authenticated) {
      return createResponse(401, { 
        success: false, 
        error: { message: 'Unauthorized' } 
      });
    }

    // Get user ID from authenticated session
    const userId = authResult.session.userId;
    
    // Get user details
    const user = await storage.getUser(userId);
    if (!user) {
      return createResponse(404, { 
        success: false, 
        error: { message: 'User not found' } 
      });
    }

    // Return user profile
    const profile: UserProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined
    };

    return createResponse(200, { success: true, data: profile });
  } catch (error) {
    console.error('Get user error:', error);
    return createResponse(500, { 
      success: false, 
      error: { message: 'Internal server error' } 
    });
  }
};
