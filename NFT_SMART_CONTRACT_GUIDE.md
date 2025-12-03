# 🎨 GenesisHQ - Leonardo da Vinci NFT Smart Contract

## Overview
This guide shows you how to create, deploy, and mint your Leonardo da Vinci NFT collection on Solana using Metaplex.

---

## Collection Details

**Total Supply**: 10,000 NFTs
- 9,989 "Codex Sketches" (Generated)
- 10 "Leonardo da Vinci Exclusives" (Rare)
- 1 "Epic Leonardo Selfie" ($5,000 prize)

**Royalties**: 15% on secondary sales
**Blockchain**: Solana
**Standard**: Metaplex Token Metadata

---

## Prerequisites

### Tools Needed
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Metaplex Sugar (NFT deployment tool)
bash <(curl -sSf https://sugar.metaplex.com/install.sh)

# Install Node.js dependencies
npm install @metaplex-foundation/js @solana/web3.js
```

### Wallets
- **Phantom Wallet**: https://phantom.app
- **Solflare Wallet**: https://solflare.com

---

## Step 1: Prepare NFT Metadata

### Folder Structure
```
/nft-collection/
├── assets/
│   ├── 0.json
│   ├── 0.png
│   ├── 1.json
│   ├── 1.png
│   └── ... (10,000 files)
├── collection.json
└── config.json
```

### Example Metadata (0.json)
```json
{
  "name": "Leonardo Codex #1",
  "symbol": "CODEX",
  "description": "A piece of Leonardo da Vinci's genius on the Solana blockchain. Own Renaissance history.",
  "image": "0.png",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Common"
    },
    {
      "trait_type": "Background",
      "value": "Parchment"
    },
    {
      "trait_type": "Sketch Type",
      "value": "Anatomy Study"
    },
    {
      "trait_type": "Era",
      "value": "Renaissance"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "0.png",
        "type": "image/png"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "YOUR_WALLET_ADDRESS",
        "share": 100
      }
    ]
  },
  "seller_fee_basis_points": 1500
}
```

### Collection Metadata (collection.json)
```json
{
  "name": "Leonardo da Vinci Collection",
  "symbol": "CODEX",
  "description": "10,000 unique Leonardo da Vinci artworks bringing Renaissance genius to Web3.",
  "image": "collection.png",
  "external_url": "https://genesishq.com",
  "seller_fee_basis_points": 1500,
  "properties": {
    "category": "image",
    "creators": [
      {
        "address": "YOUR_WALLET_ADDRESS",
        "share": 100
      }
    ]
  }
}
```

---

## Step 2: Configure Sugar

### config.json
```json
{
  "price": 0.5,
  "number": 10000,
  "symbol": "CODEX",
  "sellerFeeBasisPoints": 1500,
  "goLiveDate": "2024-12-31T00:00:00Z",
  "solTreasuryAccount": "YOUR_WALLET_ADDRESS",
  "creators": [
    {
      "address": "YOUR_WALLET_ADDRESS",
      "share": 100
    }
  ],
  "collection": {
    "name": "Leonardo da Vinci Collection",
    "uri": "https://arweave.net/YOUR_COLLECTION_URI"
  }
}
```

---

## Step 3: Deploy Collection

### Using Sugar CLI

```bash
# 1. Create Solana wallet (if you don't have one)
solana-keygen new --outfile ~/.config/solana/devnet.json

# 2. Set network (use devnet for testing)
solana config set --url https://api.devnet.solana.com

# 3. Airdrop SOL for gas fees (devnet only)
solana airdrop 2

# 4. Validate your NFT collection
sugar validate

# 5. Upload assets to Arweave/IPFS
sugar upload

# 6. Deploy collection
sugar deploy

# 7. Verify deployment
sugar verify

# 8. Create candy machine (for minting)
sugar launch
```

### For Mainnet
```bash
# Switch to mainnet
solana config set --url https://api.mainnet-beta.solana.com

# Fund wallet with real SOL (~0.5 SOL for deployment)
# Then run same commands
sugar validate
sugar upload
sugar deploy
sugar launch
```

---

## Step 4: Integrate Minting into GenesisHQ

### Install Dependencies
```bash
npm install @metaplex-foundation/js @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets
```

### Create Minting Component

See `/app/examples/NFTMintingComponent.jsx` for full implementation.

---

## Example Code Files

I've created example implementations in `/app/examples/`:

1. **NFTMintingComponent.jsx** - Complete React component for minting
2. **solana-nft-mint.js** - Core minting logic
3. **wallet-adapter-setup.js** - Solana wallet integration

---

## Step 5: Frontend Integration

### Add to Your App

```javascript
import NFTMinting from './examples/NFTMintingComponent'

// In your NFT section:
<NFTMinting 
  collectionAddress="YOUR_COLLECTION_ADDRESS"
  candyMachineAddress="YOUR_CANDY_MACHINE_ADDRESS"
/>
```

---

## Testing Checklist

### Devnet Testing
- [ ] Deploy collection to devnet
- [ ] Test minting with devnet SOL
- [ ] Verify NFT appears in wallet
- [ ] Test multiple mints
- [ ] Check metadata on Solana Explorer
- [ ] Verify royalties configuration

### Mainnet Deployment
- [ ] Audit smart contract
- [ ] Test on devnet extensively
- [ ] Fund mainnet wallet
- [ ] Deploy to mainnet
- [ ] Test mint on mainnet
- [ ] Monitor first 10 mints
- [ ] Set up royalty collection

---

## Royalty Collection

### Setup
1. Royalties automatically go to creator wallet
2. Check Solana Explorer for incoming transactions
3. Use Magic Eden or Tensor for marketplace listing

### Marketplace Listing
- **Magic Eden**: https://magiceden.io
- **Tensor**: https://tensor.trade
- **OpenSea (Solana)**: https://opensea.io

---

## Cost Breakdown

### Devnet (Testing)
- **Free**: Airdrop SOL for testing

### Mainnet (Production)
- **Storage**: ~0.01-0.02 SOL per NFT = 100-200 SOL total
- **Deployment**: ~0.1 SOL
- **Candy Machine**: ~0.5 SOL
- **Total Estimated**: **150-250 SOL** (~$15,000-25,000 at $100/SOL)

### Alternative: Lazy Minting
- Mint NFTs on-demand as users purchase
- **Cost**: ~0.02 SOL per mint = $2 per NFT
- **Benefit**: Lower upfront cost

---

## Security Best Practices

1. **Never share private keys**
2. **Use hardware wallet for mainnet** (Ledger)
3. **Test everything on devnet first**
4. **Audit smart contract** before mainnet
5. **Set update authority** carefully
6. **Verify all metadata** before deployment
7. **Monitor for suspicious activity**

---

## Resources

- **Metaplex Docs**: https://docs.metaplex.com
- **Solana Docs**: https://docs.solana.com
- **Sugar CLI**: https://docs.metaplex.com/tools/sugar
- **Phantom Wallet**: https://phantom.app
- **Solana Explorer**: https://explorer.solana.com

---

## Support

For NFT deployment help:
- Metaplex Discord: https://discord.gg/metaplex
- Solana Discord: https://discord.gg/solana

---

**Last Updated**: December 2024
**Version**: 1.0
