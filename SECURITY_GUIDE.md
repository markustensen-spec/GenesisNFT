# 🔒 GenesisHQ Security Implementation Guide

## Overview
This document outlines all security measures implemented in GenesisHQ and best practices for production deployment.

---

## 1. Authentication Security

### ✅ Implemented
- **Supabase Authentication**: Industry-standard OAuth 2.0 with PKCE flow
- **Email Verification**: Required before account activation
- **Password Hashing**: bcrypt with salt (handled by Supabase)
- **Session Management**: JWT tokens with automatic refresh
- **Password Reset**: Secure email-based recovery flow

### 🔧 Configuration
```javascript
// Already configured in /app/lib/supabase.js
// Uses environment variables for security
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server-only)
```

---

## 2. Input Validation & Sanitization

### ✅ Implemented in `/app/lib/security.js`

**Email Validation**
```javascript
import { validateEmail } from '@/lib/security'

if (!validateEmail(email)) {
  // Reject invalid email
}
```

**Password Strength**
```javascript
import { validatePassword } from '@/lib/security'

const result = validatePassword(password)
if (!result.valid) {
  console.error(result.message)
}
```

**Username Validation**
```javascript
import { validateUsername } from '@/lib/security'

if (!validateUsername(username)) {
  // Reject invalid username
}
```

**XSS Protection**
```javascript
import { sanitizeInput } from '@/lib/security'

const cleanInput = sanitizeInput(userInput)
```

---

## 3. Rate Limiting

### ✅ Implemented
Prevents brute force attacks and API abuse.

**Usage Example**
```javascript
import { rateLimit } from '@/lib/security'

const isAllowed = rateLimit(
  userEmail,      // identifier
  5,              // max 5 requests
  60000           // per 60 seconds
)

if (!isAllowed) {
  return { error: 'Too many requests. Please try again later.' }
}
```

**Recommended Limits**
- Login attempts: 5 per minute
- Registration: 3 per hour per IP
- Password reset: 3 per hour per email
- API calls: 100 per minute per user

---

## 4. Environment Variables Security

### ⚠️ CRITICAL - Never Commit These
```bash
# /app/.env (add to .gitignore)
MONGO_URL=mongodb://localhost:27017
DB_NAME=genesishq_db
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Production Checklist
- [ ] Add `.env` to `.gitignore`
- [ ] Use different keys for dev/staging/production
- [ ] Rotate keys every 90 days
- [ ] Use secrets management (AWS Secrets Manager, Vault)
- [ ] Never log sensitive data

---

## 5. HTTPS/SSL Configuration

### For Namecheap Deployment
1. **Get SSL Certificate**
   - Namecheap offers free SSL with hosting
   - Or use Let's Encrypt (free, auto-renewing)

2. **Force HTTPS**
   ```javascript
   // Add to next.config.js
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           {
             key: 'Strict-Transport-Security',
             value: 'max-age=63072000; includeSubDomains; preload'
           }
         ]
       }
     ]
   }
   ```

---

## 6. CORS & CSP Headers

### Content Security Policy
```javascript
// Add to next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    }
  ]
}
```

---

## 7. Database Security

### Supabase RLS (Row Level Security)
Already configured in `/app/supabase-setup.sql`

**Policies Applied**
- Users can only read their own profile
- Users can only update their own profile
- Public whitelist viewing
- Insert-only for whitelist entries

### MongoDB Security (if used)
```javascript
// Use connection pooling
// Limit connection string exposure
// Use MongoDB Atlas with IP whitelist
```

---

## 8. API Security Best Practices

### Implemented
✅ **Authentication Required**: Protected routes check for valid session
✅ **Input Validation**: All user inputs validated
✅ **Error Handling**: Generic error messages (no sensitive info leaked)
✅ **Logging**: Errors logged server-side only

### TODO for Production
- [ ] Implement API versioning
- [ ] Add request signing for sensitive operations
- [ ] Implement webhook signature verification
- [ ] Add distributed rate limiting (Redis)

---

## 9. Frontend Security

### ✅ Implemented
- **No sensitive keys in client code**: Only public keys exposed
- **Secure storage**: Using Supabase session management
- **XSS Prevention**: React auto-escapes by default
- **CSRF Protection**: Tokens implemented in security.js

### React Security Tips
- Never use `dangerouslySetInnerHTML` without sanitization
- Validate all props
- Use TypeScript for type safety (optional)

---

## 10. Production Deployment Checklist

### Pre-Deployment
- [ ] Enable HTTPS/SSL
- [ ] Configure environment variables
- [ ] Set up database backups
- [ ] Configure monitoring/alerts
- [ ] Run security audit: `npm audit`
- [ ] Update all dependencies
- [ ] Enable Supabase RLS policies
- [ ] Configure CORS properly
- [ ] Set rate limits
- [ ] Add logging/monitoring (Sentry, LogRocket)

### Post-Deployment
- [ ] Test all auth flows
- [ ] Verify SSL certificate
- [ ] Check security headers
- [ ] Monitor error logs
- [ ] Set up automated backups
- [ ] Create incident response plan

---

## 11. Monitoring & Alerts

### Recommended Tools
1. **Sentry** - Error tracking
2. **Supabase Dashboard** - Auth & DB monitoring
3. **Vercel Analytics** - Performance monitoring
4. **Uptime Robot** - Uptime monitoring

### Critical Alerts
- Failed login spike
- Database connection errors
- API rate limit exceeded
- SSL certificate expiry
- Unusual traffic patterns

---

## 12. Incident Response

### If Security Breach Detected
1. **Immediate**: Rotate all API keys
2. **Immediate**: Force logout all users
3. **Investigate**: Check logs for breach source
4. **Notify**: Inform affected users
5. **Document**: Write post-mortem
6. **Improve**: Update security measures

---

## 13. Regular Maintenance

### Weekly
- Check error logs
- Monitor failed login attempts

### Monthly
- Update dependencies: `npm update`
- Security audit: `npm audit fix`
- Review access logs

### Quarterly
- Rotate API keys
- Security penetration testing
- Review and update policies

---

## 14. Resources & Tools

**Security Scanning**
- `npm audit` - Check for vulnerable packages
- OWASP ZAP - Web application security testing
- Snyk - Continuous security monitoring

**SSL/TLS Testing**
- SSL Labs - Test SSL configuration
- Security Headers - Test HTTP headers

**Compliance**
- GDPR compliance (if EU users)
- CCPA compliance (if CA users)
- SOC 2 (for enterprise customers)

---

## Contact
For security concerns, contact: security@genesishq.io

**Last Updated**: December 2024
**Version**: 1.0
