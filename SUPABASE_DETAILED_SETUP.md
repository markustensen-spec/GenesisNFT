# 📊 Supabase Database Setup - Step-by-Step Guide

## Overview

You need to create a database table to track which NFTs have been minted. This prevents duplicate mints and enables randomization.

---

## 🔐 Step 1: Access Your Supabase Project

1. **Open your browser and go to:**
   ```
   https://supabase.com/dashboard
   ```

2. **Sign in** with your account credentials

3. **Select your project:**
   - Project name: `kpdwzbxanqrslupyslkw`
   - OR look for the project connected to your GenesisHQ app
   - Click on the project card to open it

4. **You should see:**
   - Left sidebar with menu options
   - Dashboard overview in the center
   - Project settings on the right

---

## 📝 Step 2: Open SQL Editor

1. **Look at the left sidebar** (dark gray menu)

2. **Find and click on:** `SQL Editor`
   - It has an icon that looks like: `</>`
   - Should be between "Database" and "Edge Functions"

3. **You'll see:**
   - "New query" button (top right)
   - List of saved queries (if any)
   - A big text editor in the middle

---

## ✍️ Step 3: Create New Query

1. **Click the green "+ New query" button** (top right corner)

2. **A text editor will open** with an empty query

3. **Name your query** (optional but helpful):
   - Look for "Untitled Query" at the top
   - Click it and rename to: `NFT Tables Setup`

---

## 📋 Step 4: Copy the SQL Script

1. **Open the file:** `/app/supabase-nft-tables.sql`
   - You can view it in your project files
   - Or I'll provide the complete script below

2. **Copy this ENTIRE script:**

```sql
-- NFT Minting Tables for Lazy Minting
-- Run this in Supabase SQL Editor

-- Table to track minted NFTs
CREATE TABLE IF NOT EXISTS public.minted_nfts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nft_number INTEGER UNIQUE NOT NULL,
  mint_address TEXT UNIQUE NOT NULL,
  owner_wallet TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  metadata_uri TEXT NOT NULL,
  transaction_signature TEXT,
  minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint to ensure NFT numbers are valid
  CONSTRAINT nft_number_range CHECK (nft_number >= 1 AND nft_number <= 10000)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_minted_nfts_owner ON public.minted_nfts(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_minted_nfts_number ON public.minted_nfts(nft_number);
CREATE INDEX IF NOT EXISTS idx_minted_nfts_email ON public.minted_nfts(owner_email);
CREATE INDEX IF NOT EXISTS idx_minted_nfts_date ON public.minted_nfts(minted_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.minted_nfts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to view minted NFTs (public collection)
CREATE POLICY "Anyone can view minted NFTs"
  ON public.minted_nfts FOR SELECT
  USING (true);

-- Policy: Only service role can insert (server-side minting)
CREATE POLICY "Service role can insert minted NFTs"
  ON public.minted_nfts FOR INSERT
  WITH CHECK (true);

-- Create a stats view for easy analytics
CREATE OR REPLACE VIEW public.nft_stats AS
SELECT 
  COUNT(*) as total_minted,
  10000 - COUNT(*) as remaining,
  COUNT(DISTINCT owner_wallet) as unique_owners,
  MIN(minted_at) as first_mint,
  MAX(minted_at) as last_mint
FROM public.minted_nfts;

-- Grant access to views
GRANT SELECT ON public.nft_stats TO anon, authenticated;
GRANT SELECT ON public.minted_nfts TO anon, authenticated;
```

3. **Paste into the SQL Editor**
   - Click in the big text area
   - Press Ctrl+A (Windows) or Cmd+A (Mac) to select all
   - Paste the script you copied

---

## ▶️ Step 5: Run the SQL Script

1. **Look at the bottom right corner** of the SQL Editor

2. **Click the green "RUN" button**
   - Or press Ctrl+Enter (Windows) / Cmd+Enter (Mac)

3. **Wait 2-3 seconds** for execution

4. **You should see:**
   ```
   Success. No rows returned
   ```
   - This is GOOD! It means tables were created successfully
   - The green "Success" message confirms everything worked

5. **If you see errors:**
   - Red text will appear
   - Common fix: Click "RUN" again (sometimes needs two tries)
   - If error persists, share the error message

---

## ✅ Step 6: Verify Table Creation

### Method 1: Table Editor

1. **Click "Table Editor"** in the left sidebar
   - Icon looks like a grid/table

2. **You should see a new table:** `minted_nfts`
   - If you don't see it, click the refresh icon

3. **Click on `minted_nfts`** to view it

4. **You should see these columns:**
   - `id` (UUID)
   - `nft_number` (int4)
   - `mint_address` (text)
   - `owner_wallet` (text)
   - `owner_email` (text)
   - `metadata_uri` (text)
   - `transaction_signature` (text)
   - `minted_at` (timestamptz)

5. **The table should be EMPTY** (0 rows)
   - This is correct! It will fill up as people mint NFTs

### Method 2: SQL Query

1. **Go back to SQL Editor**

2. **Run this query:**
   ```sql
   SELECT * FROM public.minted_nfts;
   ```

3. **You should see:**
   - Column headers
   - No data rows (empty table)
   - Message: "No rows returned"

---

## 🔍 Step 7: Verify the Stats View

1. **In SQL Editor, run:**
   ```sql
   SELECT * FROM public.nft_stats;
   ```

2. **You should see:**
   ```
   total_minted: 0
   remaining: 10000
   unique_owners: 0
   first_mint: null
   last_mint: null
   ```

3. **This confirms** everything is set up correctly!

---

## 🔐 Step 8: Verify API Access

1. **Go to:** Settings → API (in left sidebar)

2. **Verify you have these keys set in your `.env` file:**
   - `NEXT_PUBLIC_SUPABASE_URL`: Should match "Project URL"
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Should match "anon public" key

3. **In your `.env`, check:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://kpdwzbxanqrslupyslkw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **These should match** what you see in Supabase Settings → API

---

## 🧪 Step 9: Test the Setup

### Test 1: Check Stats API

Open your browser and visit:
```
https://genesis-production-6396.up.railway.app/api/nft/stats
```

**You should see:**
```json
{
  "success": true,
  "stats": {
    "totalSupply": 10000,
    "totalMinted": 0,
    "remaining": 10000,
    "uniqueOwners": 0,
    "progress": "0.00",
    "mintPriceUSD": 0.01,
    "network": "devnet",
    "recentMints": []
  }
}
```

### Test 2: Manually Add Test Row

1. **In Table Editor**, click on `minted_nfts` table

2. **Click "Insert row"** button

3. **Fill in:**
   - `nft_number`: 9999
   - `mint_address`: test123
   - `owner_wallet`: 63ANgURKqk3G1JaNxYR538fXHDbHQ4HbpddEHCKsp54w
   - `owner_email`: test@example.com
   - `metadata_uri`: https://test.com/metadata/9999
   - Leave other fields empty

4. **Click "Save"**

5. **Check stats API again**
   - Should now show: `"totalMinted": 1`
   - Should show: `"remaining": 9999`

6. **Delete the test row:**
   - Click the checkbox next to the test row
   - Click "Delete" button
   - Confirm deletion

---

## ✅ Success Checklist

Your Supabase is ready when you can confirm:

- [ ] `minted_nfts` table exists in Table Editor
- [ ] Table has 8 columns (id, nft_number, mint_address, owner_wallet, owner_email, metadata_uri, transaction_signature, minted_at)
- [ ] `nft_stats` view exists
- [ ] Stats API returns correct data
- [ ] Can manually insert and delete test rows
- [ ] Environment variables in `.env` match Supabase API settings

---

## 🐛 Common Issues & Solutions

### Issue: "relation 'minted_nfts' already exists"

**Solution:** Table is already created! You're good to go. Just verify it in Table Editor.

### Issue: "permission denied for table minted_nfts"

**Solution:**
1. Go to SQL Editor
2. Run:
   ```sql
   GRANT SELECT, INSERT ON public.minted_nfts TO anon, authenticated;
   ```

### Issue: Stats API returns "Failed to fetch stats"

**Solution:**
1. Check Supabase is online (green dot in dashboard)
2. Verify API keys in `.env` are correct
3. Check table exists in Table Editor
4. Try restarting your app

### Issue: Can't see Table Editor

**Solution:** Make sure you're on the correct project. Check project name at top of dashboard.

### Issue: RLS Policy errors

**Solution:**
1. Go to Authentication → Policies
2. Find `minted_nfts` table
3. Verify two policies exist:
   - "Anyone can view minted NFTs" (SELECT)
   - "Service role can insert minted NFTs" (INSERT)

---

## 🎯 What Happens After Setup?

Once setup is complete:

1. **When users mint NFTs:**
   - A new row is added to `minted_nfts`
   - The row contains their wallet, NFT number, timestamp

2. **Randomization works:**
   - Your app checks `minted_nfts` for already-minted NFTs
   - Selects randomly from remaining available NFTs

3. **Duplicate prevention:**
   - Each `nft_number` can only appear once (UNIQUE constraint)
   - Attempting to mint the same NFT twice will fail

4. **Stats tracking:**
   - `/api/nft/stats` shows real-time minting progress
   - You can see total minted, remaining, unique owners

---

## 📊 Monitoring Your Collection

### View All Minted NFTs

```sql
SELECT 
  nft_number,
  owner_wallet,
  owner_email,
  minted_at
FROM public.minted_nfts
ORDER BY minted_at DESC;
```

### View Stats

```sql
SELECT * FROM public.nft_stats;
```

### Find Specific NFT

```sql
SELECT * FROM public.minted_nfts
WHERE nft_number = 9990;  -- Leonardo Selfie
```

### Top Collectors

```sql
SELECT 
  owner_wallet,
  COUNT(*) as nfts_owned
FROM public.minted_nfts
GROUP BY owner_wallet
ORDER BY nfts_owned DESC
LIMIT 10;
```

---

## 🆘 Need More Help?

**If you're stuck:**
1. Take a screenshot of the error
2. Share which step you're on
3. I'll help debug!

**Common checkpoints:**
- Step 2: Can you see SQL Editor in sidebar?
- Step 5: Did you see "Success" message?
- Step 6: Can you see `minted_nfts` in Table Editor?
- Step 9: Does stats API return JSON?

---

**You're almost ready to test NFT minting!** 🎨✨
