import { CognitoJwtVerifier } from 'aws-jwt-verify';

// Interface for token verification result
interface TokenVerificationResult {
  valid: boolean;
  sub?: string;
  username?: string;
  error?: string;
}

// Verify JWT token from Cognito
export const verifyToken = async (token: string): Promise<TokenVerificationResult> => {
  try {
    if (!token) {
      return { valid: false, error: 'No token provided' };
    }

    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID || '',
      tokenUse: 'access',
      clientId: process.env.COGNITO_CLIENT_ID || '',
    });

    const payload = await verifier.verify(token);

    return {
      valid: true,
      sub: payload.sub,
      username: payload['cognito:username'],
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid token',
    };
  }
};
