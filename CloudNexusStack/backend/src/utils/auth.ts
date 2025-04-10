import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { storage } from '../db';
import { Session } from '@shared/schema';

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plaintext password with a hashed password
 */
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate a random token for authentication
 */
export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Verify auth token and return session if valid
 */
export const verifyAuth = async (authHeader: string): Promise<{ authenticated: boolean; session?: Session }> => {
  try {
    // Check if Authorization header exists and has correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false };
    }

    // Extract token from header
    const token = authHeader.substring(7);
    if (!token) {
      return { authenticated: false };
    }

    // Get session from database
    const session = await storage.getSessionByToken(token);
    if (!session) {
      return { authenticated: false };
    }

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      await storage.deleteSession(token);
      return { authenticated: false };
    }

    return { authenticated: true, session };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authenticated: false };
  }
};
