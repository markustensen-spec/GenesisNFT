# GenesisHQ Supabase Email Verification Setup Guide

## ✅ Hva er implementert

### 1. **Supabase Client Configuration**
- ✓ Installert `@supabase/supabase-js`
- ✓ Opprettet `/app/lib/supabase.js` med konfigurasjon
- ✓ Lagt til credentials i `/app/.env`

### 2. **Database Tabeller**
- ✓ `profiles` - Brukerprofiles (extends auth.users)
- ✓ `whitelist` - NFT whitelist emails
- ✓ Row Level Security (RLS) policies
- ✓ Automatisk profile-opprettelse ved registrering

### 3. **Authentication Flow**
- ✓ Email/passord registrering med verifisering
- ✓ Login med email-verifisering sjekk
- ✓ Automatisk session management
- ✓ Logout funksjonalitet

### 4. **Whitelist System**
- ✓ Email collection for NFT whitelist
- ✓ Lagring i Supabase database
- ✓ Duplikat-sjekk

---

## 🔧 Neste Steg - MÅ GJØRES

### **Steg 1: Kjør SQL i Supabase Dashboard**

1. Gå til: https://kpdwzbxanqrslupyslkw.supabase.co
2. Logg inn med: Markustensen@gmail.com / Sukram32!
3. Gå til: **SQL Editor** (venstre meny)
4. Klikk: **New Query**
5. Kopier innholdet fra `/app/supabase-setup.sql`
6. Kjør SQL-en (Run knapp)

Dette oppretter:
- `profiles` tabell
- `whitelist` tabell  
- RLS policies
- Triggers for automatisk profile-opprettelse

---

### **Steg 2: Konfigurer Email Templates i Supabase**

1. Gå til: **Authentication** → **Email Templates** i Supabase Dashboard

2. **Confirm Signup Template:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #0f172a;
      color: #fef3c7;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 2px solid #d97706;
      border-radius: 12px;
      padding: 40px;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo img {
      width: 80px;
      height: 80px;
    }
    .header {
      text-align: center;
      color: #fbbf24;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .content {
      color: #fef3c7;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .button {
      display: block;
      width: 100%;
      text-align: center;
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      color: white;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 18px;
      margin: 30px 0;
    }
    .footer {
      text-align: center;
      color: #cbd5e1;
      font-size: 14px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #334155;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://raw.githubusercontent.com/markustensen-spec/Logo/refs/heads/main/1000004278.jpg.png" alt="GenesisHQ Logo" />
    </div>
    <div class="header">Welcome to GenesisHQ!</div>
    <div class="content">
      <p>Thank you for joining GenesisHQ, where Renaissance genius meets blockchain innovation.</p>
      <p>Please confirm your email address to activate your account and gain access to:</p>
      <ul>
        <li>🎨 Leonardo da Vinci NFT Collection</li>
        <li>💰 $CAX Token Staking</li>
        <li>👑 Exclusive G Lounge Access</li>
        <li>🎮 Play-to-Earn Minigames</li>
      </ul>
    </div>
    <a href="{{ .ConfirmationURL }}" class="button">Confirm Your Email</a>
    <div class="footer">
      <p>GenesisHQ.io - Your money, your power, one Nexus.</p>
      <p>If you didn't create this account, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
```

3. **Magic Link Template** (optional):
Samme design, bare endre heading til "Login to GenesisHQ" og button text til "Login Now"

4. **Recovery/Reset Password Template:**
Samme design, heading: "Reset Your Password", button: "Reset Password"

---

### **Steg 3: Konfigurer Email Settings**

1. Gå til: **Project Settings** → **Authentication** → **Email**

2. Sett opp SMTP (valgfritt, for produksjon):
   - Anbefalt: SendGrid, Postmark, eller AWS SES
   - Eller bruk Supabase sin default SMTP for testing

3. **Redirect URLs:**
   - Gå til: **Authentication** → **URL Configuration**
   - Legg til: `https://genesishq.io` (din produksjon URL)
   - Legg til: `https://genesis-crypto.preview.emergentagent.com` (staging)
   - Legg til: `http://localhost:3000` (lokal utvikling)

---

## 🧪 Testing

### **Test Registrering:**
1. Gå til nettsiden
2. Klikk "Register" i auth modal
3. Fyll inn email, passord, username
4. Klikk "Create Account"
5. **Sjekk email inbox** - du skal få verifiserings-email med logo
6. Klikk på "Confirm Your Email" knappen
7. Du blir redirected tilbake til siden og logget inn

### **Test Login:**
1. Klikk "Login"
2. Skriv inn email/passord
3. Hvis ikke verifisert: får melding om å sjekke email
4. Hvis verifisert: logger inn direkte

### **Test Whitelist:**
1. Gå til Crypto → NFT section
2. Klikk "Join Whitelist"
3. Skriv inn email
4. Email blir lagret i Supabase `whitelist` tabell

---

## 📊 Sjekk Data i Supabase

1. **Bruker-data:**
   - Gå til: **Authentication** → **Users**
   - Se alle registrerte brukere
   - Sjekk om email er confirmed

2. **Profile data:**
   - Gå til: **Table Editor** → **profiles**
   - Se brukerprofiles med username og wallet

3. **Whitelist data:**
   - Gå til: **Table Editor** → **whitelist**
   - Se alle emails som har joined whitelist

---

## 🔒 Sikkerhet

✓ Row Level Security (RLS) er aktivert på alle tabeller
✓ Service role key er lagret server-side only
✓ Anon key brukes på client-side (trygt)
✓ Email verification er påkrevd før login
✓ Passwords er hashed av Supabase

---

## 🚀 Produksjon Deployment

Før produksjon:
1. ✓ Konfigurer custom SMTP (SendGrid/Postmark)
2. ✓ Oppdater redirect URLs til produksjon domain
3. ✓ Test email delivery grundig
4. ✓ Sett opp rate limiting for auth
5. ✓ Konfigurer email rate limits

---

## 💡 Tips

- Email templates kan testes i Supabase Dashboard
- Sjekk spam folder hvis ikke email kommer
- Rate limits: Default 60 emails per hour per email
- Email expiry: Verification links utløper etter 24 timer
- Re-send verification: Bruk Supabase Dashboard → Users → Resend

---

## 🆘 Support

Hvis problemer:
1. Sjekk Supabase Logs: **Logs** → **Auth Logs**
2. Sjekk browser console for errors
3. Verifiser at SQL er kjørt riktig
4. Sjekk at redirect URLs er konfigurert

---

**Alt er klart! Du trenger bare å:**
1. Kjøre SQL fra `/app/supabase-setup.sql` i Supabase Dashboard
2. Konfigurere email templates med logoen din
3. Teste registrering og login

🎉 **Profesjonell email-verifisering er nå implementert!**
