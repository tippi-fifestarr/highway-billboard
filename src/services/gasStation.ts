import { createGasStationClient } from '@aptos-labs/gas-station-client';
import { Network, Aptos, AptosConfig } from '@aptos-labs/ts-sdk';

// Initialize gas station client with server-side API key
export const gasStationClient = createGasStationClient({
  network: Network.TESTNET,
  apiKey: process.env.APTOS_API_KEY!,
});

// Initialize Aptos client for transaction building
export const aptos = new Aptos(new AptosConfig({ 
  network: Network.TESTNET 
}));

// Rate limiting storage (in production, use Redis or database)
interface RateLimit {
  count: number;
  resetTime: number;
}

const userRateLimit = new Map<string, RateLimit>();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowMs: 60000, // 1 minute
};

/**
 * Check if user has exceeded rate limit
 */
export function checkRateLimit(userAddress: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const userLimit = userRateLimit.get(userAddress);

  // Clean up expired entries
  if (userLimit && userLimit.resetTime <= now) {
    userRateLimit.delete(userAddress);
  }

  const currentLimit = userRateLimit.get(userAddress);
  
  if (!currentLimit) {
    // First request for this user
    userRateLimit.set(userAddress, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return { allowed: true };
  }

  if (currentLimit.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return { 
      allowed: false, 
      resetTime: currentLimit.resetTime 
    };
  }

  // Increment count
  currentLimit.count += 1;
  return { allowed: true };
}

/**
 * Validate message content
 */
export function validateMessageContent(content: string): { valid: boolean; error?: string } {
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Content must be a non-empty string' };
  }

  if (content.length === 0) {
    return { valid: false, error: 'Content cannot be empty' };
  }

  if (content.length > 100) {
    return { valid: false, error: 'Content must be 100 characters or less' };
  }

  // Basic profanity filter (extend as needed)
  const profanityWords = ['spam', 'scam', 'hack'];
  const lowerContent = content.toLowerCase();
  
  for (const word of profanityWords) {
    if (lowerContent.includes(word)) {
      return { valid: false, error: 'Content contains prohibited words' };
    }
  }

  return { valid: true };
}

/**
 * Validate transaction structure
 */
export function validateTransaction(
  transaction: { data?: { function?: string } },
  expectedFunction: string
): { valid: boolean; error?: string } {
  if (!transaction || !transaction.data) {
    return { valid: false, error: 'Invalid transaction structure' };
  }

  if (transaction.data.function !== expectedFunction) {
    return { valid: false, error: 'Unauthorized function call' };
  }

  return { valid: true };
}