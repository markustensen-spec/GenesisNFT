# 📧 Custom Email Configuration for GenesisHQ

## Overview
This guide helps you set up custom company emails for verification and password resets instead of using Supabase's default emails.

---

## Why Custom Emails?

✅ **Professional branding** (noreply@genesishq.com)
✅ **Better deliverability** (less spam)
✅ **Custom templates** (match your design)
✅ **Trust & credibility** (users trust company domains)

---

## Option 1: Using Supabase SMTP (Recommended)

Supabase allows you to use your own SMTP server.

### Step 1: Get SMTP Credentials

Choose one provider:

#### A. Namecheap Email Hosting
```
SMTP Server: mail.privateemail.com
Port: 465 (SSL) or 587 (TLS)
Username: noreply@genesishq.com
Password: your-email-password
```

#### B. SendGrid (Recommended)
```
SMTP Server: smtp.sendgrid.net
Port: 587
Username: apikey
Password: YOUR_SENDGRID_API_KEY
```

Signup: https://sendgrid.com (Free tier: 100 emails/day)

#### C. AWS SES
```
SMTP Server: email-smtp.us-east-1.amazonaws.com
Port: 587
Username: YOUR_AWS_ACCESS_KEY
Password: YOUR_AWS_SECRET_KEY
```

Signup: https://aws.amazon.com/ses

#### D. Resend (Modern Alternative)
```
API-based (no SMTP needed)
Signup: https://resend.com
Free tier: 3,000 emails/month
```

### Step 2: Configure Supabase

1. **Go to Supabase Dashboard**
   - Project Settings → Authentication → Email Templates

2. **Enable Custom SMTP**
   - Scroll to "SMTP Settings"
   - Toggle "Enable Custom SMTP"

3. **Enter SMTP Details**
   ```
   Sender Email: noreply@genesishq.com
   Sender Name: GenesisHQ
   Host: smtp.sendgrid.net (or your provider)
   Port: 587
   Username: your-username
   Password: your-password
   ```

4. **Test Connection**
   - Click "Test Connection"
   - Check for success message

### Step 3: Customize Email Templates

#### Confirmation Email Template
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #0f172a; color: #f1f5f9; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 32px; font-weight: bold; color: #fbbf24; }
    .button { 
      display: inline-block; 
      padding: 15px 30px; 
      background: linear-gradient(to right, #d97706, #b45309);
      color: white; 
      text-decoration: none; 
      border-radius: 8px;
      margin: 20px 0;
    }
    .footer { text-align: center; margin-top: 40px; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">GenesisHQ</div>
      <p>Your money, your power, one Nexus.</p>
    </div>
    
    <h2>Welcome to GenesisHQ!</h2>
    <p>Thanks for signing up. Click the button below to verify your email address:</p>
    
    <a href="{{ .ConfirmationURL }}" class="button">Verify Email Address</a>
    
    <p>Or copy and paste this link:</p>
    <p style="word-break: break-all; color: #fbbf24;">{{ .ConfirmationURL }}</p>
    
    <p>This link expires in 24 hours.</p>
    
    <div class="footer">
      <p>If you didn't sign up for GenesisHQ, you can ignore this email.</p>
      <p>&copy; 2024 GenesisHQ. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

#### Password Reset Template
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #0f172a; color: #f1f5f9; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 32px; font-weight: bold; color: #fbbf24; }
    .button { 
      display: inline-block; 
      padding: 15px 30px; 
      background: linear-gradient(to right, #d97706, #b45309);
      color: white; 
      text-decoration: none; 
      border-radius: 8px;
      margin: 20px 0;
    }
    .footer { text-align: center; margin-top: 40px; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">GenesisHQ</div>
    </div>
    
    <h2>Reset Your Password</h2>
    <p>We received a request to reset your password. Click the button below to set a new password:</p>
    
    <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
    
    <p>Or copy and paste this link:</p>
    <p style="word-break: break-all; color: #fbbf24;">{{ .ConfirmationURL }}</p>
    
    <p>This link expires in 1 hour.</p>
    
    <p><strong>If you didn't request this,</strong> please ignore this email. Your password won't change.</p>
    
    <div class="footer">
      <p>&copy; 2024 GenesisHQ. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

---

## Option 2: Custom Email Service (Advanced)

For full control, build your own email service.

### Setup

1. **Create API Route**
   ```javascript
   // /app/api/send-email/route.js
   import { Resend } from 'resend'
   
   const resend = new Resend(process.env.RESEND_API_KEY)
   
   export async function POST(request) {
     const { email, type, token } = await request.json()
     
     const templates = {
       verification: {
         subject: 'Verify your GenesisHQ account',
         html: `<p>Click here to verify: ${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}</p>`
       },
       reset: {
         subject: 'Reset your GenesisHQ password',
         html: `<p>Click here to reset: ${process.env.NEXT_PUBLIC_BASE_URL}/reset?token=${token}</p>`
       }
     }
     
     const template = templates[type]
     
     const { data, error } = await resend.emails.send({
       from: 'GenesisHQ <noreply@genesishq.com>',
       to: email,
       subject: template.subject,
       html: template.html
     })
     
     if (error) {
       return Response.json({ error }, { status: 400 })
     }
     
     return Response.json({ data })
   }
   ```

2. **Install Resend**
   ```bash
   npm install resend
   ```

3. **Add to .env**
   ```
   RESEND_API_KEY=your-resend-api-key
   ```

---

## Testing Your Email Setup

### Test Checklist
- [ ] Send test verification email
- [ ] Check inbox (not spam)
- [ ] Click verification link
- [ ] Test password reset email
- [ ] Verify links work
- [ ] Check email formatting
- [ ] Test on mobile
- [ ] Verify sender name displays correctly

### Test Commands
```bash
# Test with mail-tester.com
# Send email to: test@mail-tester.com
# Check your spam score
```

---

## Improving Email Deliverability

### 1. Domain Authentication

**SPF Record**
```
Type: TXT
Host: @
Value: v=spf1 include:sendgrid.net ~all
```

**DKIM Record**
- Get from your email provider
- Add to Namecheap DNS

**DMARC Record**
```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@genesishq.com
```

### 2. Warm Up Your Domain
- Start with low volume (10 emails/day)
- Gradually increase over 2 weeks
- Maintain good engagement rates

### 3. Monitor
- Check bounce rates
- Monitor spam complaints
- Track open rates
- Use tools like mail-tester.com

---

## Provider Comparison

| Provider | Free Tier | Cost | Deliverability | Setup |
|----------|-----------|------|----------------|-------|
| **SendGrid** | 100/day | $20/month for 50k | ⭐⭐⭐⭐⭐ | Easy |
| **Resend** | 3000/month | $20/month for 50k | ⭐⭐⭐⭐⭐ | Very Easy |
| **AWS SES** | 62k/month | $0.10/1k | ⭐⭐⭐⭐ | Complex |
| **Namecheap** | No free tier | $10/month | ⭐⭐⭐ | Easy |

**Recommendation**: Start with Resend for simplicity.

---

## Troubleshooting

### Emails Going to Spam
1. Set up SPF/DKIM/DMARC
2. Warm up domain gradually
3. Use professional content (no spam words)
4. Include unsubscribe link
5. Monitor reputation

### Emails Not Sending
1. Check SMTP credentials
2. Verify firewall allows port 587
3. Check API key permissions
4. Review error logs
5. Test with simple email first

### Links Not Working
1. Verify redirect URL in Supabase
2. Check URL encoding
3. Test link directly
4. Verify frontend route exists

---

## Next Steps

1. Choose email provider (Resend recommended)
2. Configure SMTP in Supabase
3. Customize email templates
4. Set up domain authentication
5. Test thoroughly
6. Monitor deliverability

---

## Resources

- **SendGrid Setup**: https://docs.sendgrid.com
- **Resend Docs**: https://resend.com/docs
- **Email Testing**: https://www.mail-tester.com
- **SPF/DKIM Tool**: https://mxtoolbox.com

---

**Last Updated**: December 2024
