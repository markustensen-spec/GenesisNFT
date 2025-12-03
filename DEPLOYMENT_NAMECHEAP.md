# 🚀 GenesisHQ Deployment Guide - Namecheap

## Overview
This guide walks you through deploying GenesisHQ to your Namecheap hosting with custom domain.

---

## Prerequisites

✅ Namecheap shared hosting or VPS
✅ Domain purchased (e.g., genesishq.com)
✅ Node.js support on hosting (required for Next.js)
✅ SSH access (for VPS)

---

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)
**Pros**: Zero-config, automatic SSL, global CDN, free tier
**Best for**: Next.js apps (like GenesisHQ)

### Option 2: Namecheap VPS
**Pros**: Full control, custom server config
**Best for**: Advanced users, custom requirements

### Option 3: Namecheap Shared Hosting
**Limitation**: Most shared hosting doesn't support Next.js SSR
**Alternative**: Build static export, upload via FTP

---

## 🎯 RECOMMENDED: Deploy to Vercel + Custom Domain

This is the easiest and most reliable method for Next.js apps.

### Step 1: Deploy to Vercel

1. **Sign up for Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub (free)

2. **Connect Your Repository**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Environment Variables**
   ```
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   MONGO_URL=your-mongo-connection-string
   DB_NAME=genesishq_db
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `your-app.vercel.app`

### Step 2: Connect Custom Domain (Namecheap)

1. **In Vercel Dashboard**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your domain: `genesishq.com`
   - Add www subdomain: `www.genesishq.com`

2. **In Namecheap Dashboard**
   - Log into Namecheap
   - Go to "Domain List" → Click your domain
   - Click "Advanced DNS"

3. **Add DNS Records**
   
   **For Root Domain (genesishq.com)**
   ```
   Type: A Record
   Host: @
   Value: 76.76.21.21
   TTL: Automatic
   ```

   **For WWW Subdomain**
   ```
   Type: CNAME Record
   Host: www
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

4. **Wait for DNS Propagation**
   - Takes 5 minutes to 24 hours
   - Check status: https://dnschecker.org

5. **Verify in Vercel**
   - Vercel will auto-issue SSL certificate
   - Your site will be live at `https://genesishq.com`

---

## Alternative: Namecheap VPS Deployment

If you have a VPS and want full control:

### Step 1: Prepare VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install nginx -y
```

### Step 2: Upload Your App

```bash
# Option A: Git Clone
cd /var/www
git clone https://github.com/yourusername/genesishq.git
cd genesishq

# Option B: Upload via FTP
# Use FileZilla to upload to /var/www/genesishq
```

### Step 3: Install Dependencies

```bash
cd /var/www/genesishq
npm install
```

### Step 4: Configure Environment

```bash
# Create .env file
nano .env
```

Paste:
```
NEXT_PUBLIC_BASE_URL=https://genesishq.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
MONGO_URL=your-mongo-url
DB_NAME=genesishq_db
```

Save: `Ctrl+X` → `Y` → `Enter`

### Step 5: Build App

```bash
npm run build
```

### Step 6: Start with PM2

```bash
# Start app
pm2 start npm --name "genesishq" -- start

# Save PM2 process list
pm2 save

# Auto-start on server reboot
pm2 startup
```

### Step 7: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/genesishq
```

Paste:
```nginx
server {
    listen 80;
    server_name genesishq.com www.genesishq.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Save and enable:
```bash
sudo ln -s /etc/nginx/sites-available/genesishq /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Setup SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d genesishq.com -d www.genesishq.com

# Auto-renewal (certbot sets this up automatically)
# Test renewal:
sudo certbot renew --dry-run
```

### Step 9: Point Domain to VPS

1. **In Namecheap DNS Settings**
   ```
   Type: A Record
   Host: @
   Value: YOUR_VPS_IP
   TTL: Automatic
   
   Type: A Record
   Host: www
   Value: YOUR_VPS_IP
   TTL: Automatic
   ```

2. **Wait for DNS propagation** (5 min - 24 hours)

---

## Post-Deployment Checklist

### Security
- [ ] HTTPS enabled and working
- [ ] Force HTTPS redirect
- [ ] Security headers configured
- [ ] Firewall rules set (UFW on VPS)
- [ ] SSH key-only access (disable password)

### Testing
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test password reset
- [ ] Test email verification
- [ ] Check mobile responsiveness
- [ ] Test all navigation
- [ ] Verify crypto prices loading

### Monitoring
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure error tracking (Sentry)
- [ ] Set up backups
- [ ] Configure alerts

### Performance
- [ ] Run Lighthouse audit
- [ ] Enable Cloudflare (optional CDN)
- [ ] Optimize images
- [ ] Enable caching

---

## Troubleshooting

### Issue: "502 Bad Gateway"
**Solution**: Check if Next.js is running
```bash
pm2 status
pm2 logs genesishq
```

### Issue: "DNS not resolving"
**Solution**: Wait longer or flush DNS
```bash
# On your computer
ipconfig /flushdns  # Windows
sudo dscacheutil -flushcache  # Mac
```

### Issue: "SSL certificate error"
**Solution**: Verify Certbot setup
```bash
sudo certbot certificates
sudo certbot renew
```

### Issue: "Environment variables not working"
**Solution**: Rebuild and restart
```bash
npm run build
pm2 restart genesishq
```

---

## Updating Your App

### Vercel (Automatic)
- Just push to GitHub
- Vercel auto-deploys

### VPS (Manual)
```bash
cd /var/www/genesishq
git pull
npm install
npm run build
pm2 restart genesishq
```

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Namecheap Support**: https://www.namecheap.com/support/
- **Let's Encrypt**: https://letsencrypt.org/docs/
- **PM2 Docs**: https://pm2.keymetrics.io/docs/

---

## Cost Breakdown

### Vercel Deployment (Recommended)
- Vercel Hobby: **FREE**
- Domain (Namecheap): **$10-15/year**
- Supabase Free Tier: **FREE**
- **Total: ~$12/year**

### VPS Deployment
- Namecheap VPS: **$10-30/month**
- Domain: **$10-15/year**
- **Total: ~$120-360/year**

---

**Need Help?** Contact support or check deployment logs.

**Last Updated**: December 2024
