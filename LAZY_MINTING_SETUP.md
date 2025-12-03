# 🚀 Lazy Minting Setup Guide - GenesisHQ

## What I've Built For You

I've implemented a complete lazy minting system where NFTs are minted on-demand when users purchase them. This saves you ~$15,000-25,000 in upfront costs!

---

## ✅ What's Already Done

### 1. **Backend API Routes**
- `/api/nft/metadata/[id]` - Dynamic NFT metadata generation
- `/api/nft/mint` - Minting endpoint
- `/api/nft/verify-payment` - Payment verification
- `/api/nft/stats` - Collection statistics

### 2. **Smart Configuration**
- Your wallet address configured: `uG8asasuaHPTJwypsuS2xaAychFQU5ZaiE5VPpAFsoh`
- Collection details: 10,000 NFTs, 15% royalties
- Free Solana RPC endpoint
- Dynamic metadata for all 3 tiers (Common, Exclusive, Epic)

### 3. **Frontend Minting Component**
- Phantom wallet integration
- Payment flow
- Minting UI with progress tracking
- Success/error handling

### 4. **Security**
- Rate limiting on mints
- Payment verification
- Input validation
- Database tracking

---

## ⚠️ HURDLES - What YOU Need to Provide

### Hurdle #1: Wallet Private Key (CRITICAL)

**Problem**: I need your wallet's private key to sign minting transactions.

**Solution**:

1. **Export from Phantom:**
   - Open Phantom wallet
   - Settings → Security & Privacy
   - Export Private Key
   - Copy the key

2. **Convert to format needed:**
   ```bash
   # If you have base58 key, convert it:
   # Use this tool: https://base58.io
   # Or use Solana CLI:
   solana-keygen pubkey <your-keypair.json>
   ```

3. **Add to `.env`:**
   ```
   SOLANA_PRIVATE_KEY=[123,45,67,89,...]
   ```
   **⚠️ NEVER share this or commit to git!**

**Alternative (Safer)**:
Use a separate "minting wallet" instead of your main wallet:
```bash
# Create new wallet just for minting
solana-keygen new --outfile minting-wallet.json

# Send it some SOL for transaction fees (~0.1 SOL)
solana transfer <new-wallet-address> 0.1
```

---

### Hurdle #2: NFT Images (10,000 images)

**Problem**: You need actual images for your NFTs.

**Options**:

**A. AI Generation (Fastest)**
- Use MidJourney / Stable Diffusion
- Prompt: "Leonardo da Vinci sketch, renaissance art, anatomy study"
- Generate 10,000 variations
- Tools: midjourney.com, leonardo.ai, runwayml.com

**B. Commission Artist**
- Hire artist to create base art + variations
- Cost: $500-5000 depending on quality

**C. Use Placeholder (Testing)**
- I've set up image URLs at: `/images/nft/[tier]/[number].png`
- Upload placeholder images for testing

**Where to host images**:
1. **Arweave** (permanent storage) - Recommended
   - Cost: ~$0.02 per NFT = $200 total
   - Permanent, decentralized

2. **IPFS** (free but less permanent)
   - Use Pinata.cloud or NFT.storage
   - Free tier available

3. **Your server** (simplest for testing)
   - Create `/public/images/nft/` folder
   - Upload images there

---

### Hurdle #3: Database Tables

**Problem**: Need to create NFT tracking tables.

**Solution**: Run SQL in Supabase

1. Go to Supabase Dashboard
2. SQL Editor
3. Run the script from: `/app/supabase-nft-tables.sql`

This creates:
- `minted_nfts` table (tracks all mints)
- Indexes for fast queries
- RLS policies for security

---

### Hurdle #4: Fund the Minting Wallet

**Problem**: Need SOL for transaction fees.

**How much?**
- ~0.001-0.002 SOL per mint
- For 10,000 NFTs: ~10-20 SOL total
- Start with 1 SOL for testing

**How to send**:
```bash
solana transfer <your-minting-wallet-address> 1
```

Or use Phantom wallet to send.

---

## 🔧 Setup Steps (In Order)

### Step 1: Environment Variables

Add to `/app/.env`:
```bash
# Your wallet private key (CRITICAL)
SOLANA_PRIVATE_KEY=[your,private,key,array]

# Solana config
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com

# Your domain
NEXT_PUBLIC_BASE_URL=https://genesishq.io
```

### Step 2: Database Setup

Run in Supabase:
```sql
-- Copy content from /app/supabase-nft-tables.sql
```

### Step 3: Upload Images

Create folder structure:
```
/public/images/nft/
  ├── common/
  │   ├── 1.png
  │   ├── 2.png
  │   └── ... (9989 images)
  ├── legendary/
  │   ├── 9990.png
  │   └── ... (10 images)
  └── epic/
      └── 10000.png
```

### Step 4: Test Minting

1. Install Phantom: phantom.app
2. Add Solana devnet
3. Get test SOL: solfaucet.com
4. Test mint on devnet first
5. Switch to mainnet when ready

---

## 🧪 Testing Checklist

**Devnet Testing** (Use free test SOL):
- [ ] Change `.env`: `NEXT_PUBLIC_SOLANA_NETWORK=devnet`
- [ ] Get test SOL from faucet
- [ ] Test wallet connection
- [ ] Test payment flow
- [ ] Test minting
- [ ] Verify NFT appears in wallet
- [ ] Check metadata loads correctly

**Mainnet Launch**:
- [ ] Images uploaded and accessible
- [ ] Database tables created
- [ ] Wallet funded with SOL
- [ ] Environment variables set
- [ ] Tested payment verification
- [ ] Tested 1-2 real mints
- [ ] Monitor first 10 mints closely

---

## 💰 Cost Breakdown

**Per NFT Mint**:
- Transaction fee: ~0.001 SOL = $0.10
- Metaplex fee: ~0.01 SOL = $1
- Your profit: 0.489 SOL = $49
- **Total cost to you: ~$1.10 per mint**
- **Total revenue: $50 per mint**

**Full Collection (10,000 NFTs)**:
- Your costs: ~$11,000 (fees)
- Revenue: ~$500,000 (at 0.5 SOL = $50)
- **Net profit: ~$489,000**

Vs upfront minting: $15k-25k upfront cost.

---

## 📊 How It Works

1. **User clicks "Mint NFT"**
2. **User pays 0.5 SOL** to your wallet
3. **Backend verifies payment** (checks blockchain)
4. **Backend mints NFT** using your wallet
5. **Backend transfers NFT** to user's wallet
6. **Backend records mint** in database
7. **User receives NFT** in Phantom wallet

**Estimated time per mint: 10-30 seconds**

---

## 🚨 Security Notes

1. **Private Key Safety**:
   - Never commit to git
   - Use environment variables only
   - Consider using separate minting wallet
   - Rotate keys every 6 months

2. **Rate Limiting**:
   - Already implemented: 3 mints per hour per wallet
   - Prevents spam/abuse

3. **Payment Verification**:
   - Backend verifies every transaction
   - No free mints possible

4. **Database Security**:
   - Supabase RLS policies active
   - Only backend can insert mints

---

## 📞 What to Tell Me

I need you to provide:

1. **Private key** (securely, don't post publicly)
   - Format: `[123,45,67,...]` (array of 64 numbers)
   
2. **Images ready?**
   - Yes/No
   - If yes, where are they hosted?
   
3. **Database tables created?**
   - Yes/No
   - Any errors?

4. **Domain DNS configured?**
   - GenesisHQ.io pointing to Vercel?
   - Ready to test?

---

## 🎯 Next Actions

**For Testing (Today)**:
1. Get your private key ready
2. Run database SQL script
3. Upload 1-2 test images
4. We can test mint on devnet

**For Production (This Week)**:
1. Generate/commission 10,000 images
2. Upload to Arweave/IPFS
3. Configure mainnet
4. Test with real SOL
5. Launch! 🚀

---

**Questions? Issues? Tell me and I'll help solve them!**
