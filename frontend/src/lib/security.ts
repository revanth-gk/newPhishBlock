// Security utilities for the PhishBlock application

// Rate limiting store (in production, this should be stored in Redis or similar)
const rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();

// Rate limiting function
export function rateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const record = rateLimitStore.get(identifier);
  
  // If no record exists or the window has expired, create a new one
  if (!record || record.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }
  
  // If the request count is below the limit, increment and allow
  if (record.count < maxRequests) {
    rateLimitStore.set(identifier, {
      count: record.count + 1,
      resetTime: record.resetTime,
    });
    return true;
  }
  
  // Otherwise, reject the request
  return false;
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate IPFS hash format
export function validateIPFSHash(hash: string): boolean {
  // Basic IPFS hash validation (CIDv0)
  const ipfsRegex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  return ipfsRegex.test(hash);
}

// Validate Ethereum address format
export function validateEthereumAddress(address: string): boolean {
  // Check if it's a valid Ethereum address format
  const walletRegex = /^0x[a-fA-F0-9]{40}$/;
  return walletRegex.test(address);
}

// Validate URL format
export function validateURL(url: string): boolean {
  try {
    // Check if it starts with http or https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }
    
    // Basic URL validation
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// Validate report type
export function validateReportType(type: string): boolean {
  return type === 'URL' || type === 'WALLET';
}