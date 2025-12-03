// Security utilities for GenesisHQ

// Rate limiting store (in-memory for now, use Redis in production)
const rateLimitStore = new Map()

/**
 * Rate limiter middleware
 * @param {string} identifier - Unique identifier (IP, email, etc.)
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - Whether request is allowed
 */
export function rateLimit(identifier, maxRequests = 5, windowMs = 60000) {
  const now = Date.now()
  const key = `${identifier}`
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, [])
  }
  
  const timestamps = rateLimitStore.get(key)
  
  // Remove old timestamps outside the window
  const validTimestamps = timestamps.filter(time => now - time < windowMs)
  
  if (validTimestamps.length >= maxRequests) {
    return false // Rate limit exceeded
  }
  
  validTimestamps.push(now)
  rateLimitStore.set(key, validTimestamps)
  
  return true // Request allowed
}

/**
 * Input sanitization
 * Prevents XSS attacks by escaping HTML special characters
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Email validation
 * Strict email format validation
 */
export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email)
}

/**
 * Password strength validation
 * Requires: min 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  
  return { valid: true, message: 'Password is strong' }
}

/**
 * Username validation
 * Alphanumeric, 3-20 characters, underscores allowed
 */
export function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * CSRF Token generation
 * Generate a random token for CSRF protection
 */
export function generateCSRFToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Clean up old rate limit entries
 * Call this periodically to prevent memory leaks
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  const oneHourAgo = now - 3600000
  
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const validTimestamps = timestamps.filter(time => time > oneHourAgo)
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key)
    } else {
      rateLimitStore.set(key, validTimestamps)
    }
  }
}

// Clean up every hour
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitStore, 3600000)
}
