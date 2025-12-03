# 🧪 NFT Minting - Testing Guide

## ✅ Setup Complete!

**Your Wallet:**
- Address: `63ANgURKqk3G1JaNxYR538fXHDbHQ4HbpddEHCKsp54w`
- Network: Solana Devnet
- Private key: ✅ Configured in `.env`

---

## 📋 Step 1: Set Up Supabase Database

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Select your project: `kpdwzbxanqrslupyslkw`

2. **Run SQL Setup:**
   - Click "SQL Editor" (left sidebar)
   - Click "New Query"
   - Copy and paste from `/app/supabase-nft-tables.sql`
   - Click "Run" button

3. **Verify Table Created:**
   - Go to "Table Editor"
   - You should see: `minted_nfts` table

---

## 💰 Step 2: Get Devnet SOL

**Option A: Online Faucet (Easiest)**
1. Visit: https://faucet.solana.com
2. Paste your wallet: `63ANgURKqk3G1JaNxYR538fXHDbHQ4HbpddEHCKsp54w`
3. Select "Devnet"
4. Request 2 SOL
5. Wait 30 seconds

**Option B: Solana CLI**
```bash
solana airdrop 2 63ANgURKqk3G1JaNxYR538fXHDbHQ4HbpddEHCKsp54w --url devnet
```

**Option C: Phantom Wallet**
1. Open Phantom
2. Settings → Change Network → Devnet
3. Tap wallet address to copy
4. Use faucet from Option A

---

## 🔍 Step 3: Verify Balance

Check your balance:
```bash
curl -X POST https://api.devnet.solana.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getBalance","params":["63ANgURKqk3G1JaNxYR538fXHDbHQ4HbpddEHCKsp54w"]}'
```

You should see something like: `"value": 2000000000` (2 SOL)

---

## 🎨 Step 4: Test NFT Minting

### A. Test Metadata Generation

Test different NFT types:

```bash
# Regular Codex Sketch
curl https://next-web3-platform.preview.emergentagent.com/api/nft/metadata/100

# Mystery Blank Page (if lucky!)
curl https://next-web3-platform.preview.emergentagent.com/api/nft/metadata/1

# Epic Leonardo Selfie ($5K prize)
curl https://next-web3-platform.preview.emergentagent.com/api/nft/metadata/9990

# Legendary Exclusive
curl https://next-web3-platform.preview.emergentagent.com/api/nft/metadata/9995
```

### B. Check Collection Stats

```bash
curl https://next-web3-platform.preview.emergentagent.com/api/nft/stats
```

Should show:
```json
{
  "success": true,
  "stats": {
    "totalMinted": 0,
    "remaining": 10000,
    "mintPriceUSD": 0.01
  }
}
```

### C. Test Actual Minting

1. **Open your deployed site:**
   ```
   https://genesis-production-6396.up.railway.app
   ```

2. **Connect Phantom Wallet:**
   - Make sure Phantom is on **Devnet**
   - Import your seed phrase if needed
   - Connect wallet

3. **Go to "Crypto" section**

4. **Click "Mint NFT"**

5. **Verify:**
   - Shows price: $0.01 USD
   - Shows wallet connected
   - Shows available supply

6. **Complete Mint:**
   - Enter your email
   - Click "Mint Now"
   - Approve transaction in Phantom
   - Wait for confirmation

7. **Check Results:**
   - You should see which NFT you got!
   - Check if it's a mystery blank page (lucky!)
   - Verify metadata on Solana Explorer

---

## 🔬 Step 5: Verify On-Chain

After minting, verify on Solana Explorer:

1. **Go to:** https://explorer.solana.com/?cluster=devnet
2. **Search your wallet:** `63ANgURKqk3G1JaNxYR538fXHDbHQ4HbpddEHCKsp54w`
3. **Check transactions:**
   - Should see NFT mint transaction
   - Should see token in your wallet

---

## 🎯 What to Test:

- [ ] Metadata API returns correct data
- [ ] Stats API shows accurate numbers
- [ ] Wallet connects successfully
- [ ] Mint price shows $0.01 USD
- [ ] SOL price conversion works
- [ ] Random NFT selection (mint multiple times)
- [ ] Can't mint same NFT twice
- [ ] Mystery blank pages appear (~1% chance)
- [ ] Database records mint correctly
- [ ] Transaction appears on Solana Explorer

---

## 🐛 Troubleshooting

**"Wallet not connected" error:**
- Make sure Phantom is on Devnet
- Refresh page and reconnect

**"Insufficient SOL" error:**
- Get more devnet SOL from faucet
- Need ~0.01 SOL per mint

**"Transaction failed" error:**
- Check RPC endpoint is responding
- Verify private key is correct format
- Check wallet has SOL

**Metadata not loading:**
- Check image URLs are accessible
- Verify `/api/nft/metadata/1` works

**Database errors:**
- Make sure Supabase tables are created
- Check Supabase API keys in `.env`

---

## ✅ Success Checklist

After successful testing, you should have:
- [x] Wallet configured with devnet SOL
- [x] Supabase database tables created
- [x] Metadata API working for all NFT types
- [x] Stats API showing collection data
- [x] Successfully minted at least 1 NFT
- [x] Verified mint on Solana Explorer
- [x] Randomization working correctly
- [x] No duplicate mints possible

---

## 🚀 Ready for Production?

Once testing passes, you can:
1. Switch to mainnet (`.env`: `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta`)
2. Update price (`.env`: `NEXT_PUBLIC_MINT_PRICE_USD=85`)
3. Fund mainnet wallet with real SOL
4. Launch public mint!

---

## 📞 Need Help?

If you encounter issues:
1. Check server logs: `tail -f /var/log/supervisor/nextjs.out.log`
2. Check database: Supabase → Table Editor → minted_nfts
3. Check Solana: https://explorer.solana.com/?cluster=devnet

---

**Happy Testing!** 🎨✨
