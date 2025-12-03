# 🔧 RASK FIX: Email Verifisering

## Problem: 
Du får "Registrering vellykket!" men ingen email kommer.

## Løsning (2 STEG):

---

## STEG 1: Kjør SQL (MÅ GJØRES!)

1. **Åpne denne lenken:** 
   https://kpdwzbxanqrslupyslkw.supabase.co/project/_/sql/new

2. **Kopier HELE denne SQL-koden:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create whitelist table for NFT minting
CREATE TABLE IF NOT EXISTS public.whitelist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whitelist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can join whitelist" ON public.whitelist;
DROP POLICY IF EXISTS "Users can view own whitelist entry" ON public.whitelist;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Whitelist policies  
CREATE POLICY "Anyone can join whitelist"
  ON public.whitelist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own whitelist entry"
  ON public.whitelist FOR SELECT
  USING (true);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, wallet_address)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'wallet_address'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

3. **Klikk "RUN" (▶️ knappen)**

4. **Vent til det står "Success"**

---

## STEG 2: Aktiver Email Verifisering

1. **I Supabase Dashboard, gå til:**
   `Authentication` → `Providers` → `Email`

2. **Sjekk at disse er PÅ:**
   - ✅ "Enable email provider" 
   - ✅ "Confirm email"

3. **Hvis "Confirm email" er AV:**
   - Slå den PÅ
   - Klikk "Save"

---

## STEG 3 (VALGFRITT): Sett Redirect URLs

1. **Gå til:** `Authentication` → `URL Configuration`

2. **Legg til i "Redirect URLs":**
```
https://genesishq-web3.preview.emergentagent.com
http://localhost:3000
```

3. **Klikk "Save"**

---

## TEST DET NÅ:

1. Gå til nettsiden
2. Klikk "Login" → "Register"
3. Fyll inn ny email (ikke samme som før)
4. Klikk "Create Account"
5. **SJEKK DIN EMAIL!** (også spam)

Du skal nå få en email fra Supabase med "Confirm your signup" link!

---

## 🔍 Hvis du FORTSATT ikke får email:

### Sjekk i Supabase Dashboard:
1. Gå til `Authentication` → `Users`
2. Finn din bruker
3. Sjekk kolonnen "Email Confirmed"
4. Hvis den er rød/not confirmed, klikk på brukeren
5. Klikk "Send confirmation email"

### Eller deaktiver email verifisering midlertidig:
1. Gå til `Authentication` → `Providers` → `Email`
2. Slå AV "Confirm email"
3. Klikk "Save"
4. Nå kan du registrere og logge inn UTEN email-verifisering
5. (Ikke anbefalt for produksjon)

---

## 🎉 Når alt fungerer:

✅ Du kan registrere
✅ Du får email
✅ Du kan verifisere
✅ Du kan logge inn
✅ Du er inne i GenesisHQ!

**Gjør STEG 1 og STEG 2 nå!**
