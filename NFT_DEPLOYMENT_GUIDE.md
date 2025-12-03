# GenesisHQ NFT Collection - Deployment Guide

## 🎨 Collection Overview

**Leonardo da Vinci Codex Collection**
- 10,000 unique NFTs
- 9,989 Codex Sketches (with ~100 mystery blank pages)
- 10 Leonardo da Vinci Exclusives (Legendary)
- 1 Epic Leonardo Selfie with $5,000 prize
- 15% creator royalties on all sales
- **Randomized minting** - collectors get a surprise!

---

## 🔧 Current Configuration

### Testing Mode (Devnet)
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_MINT_PRICE_USD=0.01
```
- Cheap testing price: $0.01 USD
- Uses Solana Devnet (fake SOL)
- Perfect for testing the full mint flow

### Production Mode (Mainnet)
```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_MINT_PRICE_USD=85
```
- Real mint price: $85 USD in SOL
- Uses Solana Mainnet (real SOL)
- Ready for public launch

---

## 🚀 Deployment Steps

### Step 1: Test on Devnet

1. **Get Devnet SOL:**
   ```bash
   solana airdrop 2 uG8asasuaHPTJwypsuS2xaAychFQU5ZaiE5VPpAFsoh --url devnet
   ```

2. **Add wallet private key to `.env`:**
   ```env
   SOLANA_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
   ```

3. **Test mint:**
   - Go to your deployed site
   - Connect Phantom wallet
   - Try minting (costs $0.01 on devnet)
   - Verify randomization works
   - Check metadata displays correctly

4. **Verify on Solana Explorer:**
   - https://explorer.solana.com/?cluster=devnet

### Step 2: Deploy to Railway Production

1. **Update Railway environment variables:**
   ```
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   NEXT_PUBLIC_MINT_PRICE_USD=85
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   SOLANA_PRIVATE_KEY=[your mainnet wallet private key]
   NEXT_PUBLIC_COLLECTION_WALLET=uG8asasuaHPTJwypsuS2xaAychFQU5ZaiE5VPpAFsoh
   ```

2. **Fund mainnet wallet:**
   - Send real SOL to: `uG8asasuaHPTJwypsuS2xaAychFQU5ZaiE5VPpAFsoh`
   - Recommended: 5-10 SOL to cover minting costs

3. **Deploy and test:**
   - Push code to GitHub
   - Railway auto-deploys
   - Test 1-2 mints with real SOL

### Step 3: Connect Custom Domain

1. **In Railway:**
   - Settings → Networking → Custom Domain
   - Add: `genesishq.io`

2. **In Namecheap:**
   - Add CNAME record provided by Railway
   - Wait 5-30 minutes for DNS propagation

### Step 4: Launch! 🚀

- Announce on social media
- Share mint link: `https://genesishq.io`
- Monitor stats: `https://genesishq.io/api/nft/stats`

---

## 📊 Monitoring

### Check Collection Stats
```bash
curl https://genesishq.io/api/nft/stats
```

**Returns:**
```json
{
  "success": true,
  "stats": {
    "totalSupply": 10000,
    "totalMinted": 0,
    "remaining": 10000,
    "uniqueOwners": 0,
    "progress": "0.00",
    "mintPriceUSD": 85,
    "network": "mainnet-beta"
  }
}
```

### View Metadata
```bash
curl https://genesishq.io/api/nft/metadata/1
```

---

## 🎯 Special NFTs

**Ultra-Rare Finds:**
- **Mystery Blank Pages:** ~1% chance (100 out of 9,989)
- **Leonardo Exclusives:** NFTs #9991-10000 (10 total)
- **Epic Selfie:** NFT #9990 (1 of 1, $5,000 prize)

**All minting is randomized!** Collectors don't know what they'll get until after minting.

---

## 🔐 Security Checklist

- [ ] Private key stored securely in Railway environment variables
- [ ] Private key NOT committed to GitHub
- [ ] Rate limiting enabled (3 mints per hour per wallet)
- [ ] Email validation on mint
- [ ] Duplicate mint prevention
- [ ] CORS headers configured

---

## 💰 Pricing Calculator

Current exchange rate needed for SOL conversion:
```javascript
const solPrice = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
const priceInSOL = MINT_PRICE_USD / solPrice.data.solana.usd
```

**Testing:** $0.01 USD ≈ 0.0001 SOL
**Production:** $85 USD ≈ variable (check current SOL price)

---

## 🆘 Troubleshooting

**"Wallet not configured" error:**
- Check `SOLANA_PRIVATE_KEY` is set in Railway
- Ensure it's the correct format (base58 or JSON array)

**"All NFTs minted" error:**
- Collection sold out! 🎉

**Metadata not loading:**
- Check `/api/nft/metadata/1` endpoint
- Verify images are accessible

**Transaction failing:**
- Check wallet has enough SOL for transaction fees
- Verify RPC endpoint is responding

---

## 📈 Next Steps After Launch

1. Monitor sales via stats API
2. Award $5,000 prize to Leonardo Selfie winner (NFT #9990)
3. Set up community Discord/Telegram
4. Enable Codex Collective voting
5. Launch $CAX token staking

---

**Your collection is ready to launch!** 🎨✨
