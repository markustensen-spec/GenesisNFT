# Leonardo da Vinci NFT Minting System

## Treasury Wallet Configuration

**Treasury Wallet Address**: `3AZNcE4Ms8zoRJRiPoAMwnyKJzbcqMSomtWRMXvkz8Qn`

All minting payments (100 SOL per NFT) are sent directly to this wallet address.

## Minting System Overview

### Current Status: TESTNET (Devnet)
- Network: Solana Devnet
- Mint Price: 100 SOL (~$100 USD)
- Collection Size: 10,000 NFTs
- Current Images: 5 Leonardo da Vinci anatomical sketches

### NFT Collection Details

**Collection Name**: Leonardo da Vinci Codex
**Symbol**: DAVINCI
**Total Supply**: 10,000 NFTs
- Original Pieces: 10
- Generative Pieces: 9,990

### Current NFT Images (5 pieces):

1. **Anatomia del Corpo** - https://customer-assets.emergentagent.com/job_genesishq/artifacts/e8vx47cp_grok_image_sidn9a.jpg
2. **Studio delle Membra** - https://customer-assets.emergentagent.com/job_genesishq/artifacts/8bolikx2_grok_image_xwwjcmi-1.jpg
3. **Codice Muscolare** - https://customer-assets.emergentagent.com/job_genesishq/artifacts/dsa5mpph_grok_image_srmrao.jpg
4. **Disegno Anatomico** - https://customer-assets.emergentagent.com/job_genesishq/artifacts/z8mdzpxa_grok_image_7l8qdo.jpg
5. **Corpo Umano** - https://customer-assets.emergentagent.com/job_genesishq/artifacts/rqwrdsfj_grok_image_srmrao-1.jpg

## Minting Flow

### Step 1: User Initiates Mint
- User clicks "Mint NFT - 100 SOL" button
- System creates mint transaction

### Step 2: Payment
- User sends 100 SOL to treasury wallet: `3AZNcE4Ms8zoRJRiPoAMwnyKJzbcqMSomtWRMXvkz8Qn`
- Transaction recorded on Solana blockchain

### Step 3: NFT Creation
- System confirms payment
- Assigns random NFT from collection
- Generates Italian name
- Records mint in database

### Step 4: NFT Delivered
- User receives NFT metadata
- NFT includes:
  - Unique Leonardo da Vinci image
  - Italian Renaissance name
  - Lifetime Codex Collective voting rights
  - Enhanced $CAX staking rewards

## API Endpoints

### Create Mint Transaction
```
POST /api/nft/create-mint
Body: { "walletAddress": "user_wallet_address" }
Returns: { "treasury": "3AZN...", "amount": 100, "success": true }
```

### Confirm Mint
```
POST /api/nft/confirm-mint
Body: { 
  "walletAddress": "user_wallet_address",
  "txSignature": "transaction_signature" 
}
Returns: { "success": true, "nft": {...} }
```

## NFT Metadata Structure

```json
{
  "name": "Anatomia del Corpo #0001",
  "description": "Leonardo da Vinci Codex Collection - Renaissance anatomical study with lifetime Codex Collective voting rights",
  "image": "https://...",
  "attributes": [
    { "trait_type": "Collection", "value": "Leonardo da Vinci Codex" },
    { "trait_type": "Type", "value": "Original" },
    { "trait_type": "Rarity", "value": "Legendary" },
    { "trait_type": "Transaction", "value": "tx_signature" }
  ]
}
```

## Italian Names (50+ names included)

- Anatomia del Corpo
- Studio delle Membra
- Codice Muscolare
- Disegno Anatomico
- Corpo Umano
- Sistema Muscolare
- Struttura Ossea
- Venature Profonde
- Meccanica del Movimento
- Proporzioni Divine
- ... and 40+ more

## Benefits for NFT Holders

1. **Permanent Voting Rights** - Lifetime voting in Codex Collective
2. **Enhanced Staking** - Increased $CAX staking rewards
3. **Exclusive Access** - Priority access to future drops
4. **Community Features** - Lifetime access to premium content

## Production Deployment Checklist

### Before Mainnet Launch:

- [ ] Generate remaining 9,995 unique images
- [ ] Upload all images to IPFS/Arweave
- [ ] Deploy Metaplex Candy Machine
- [ ] Audit smart contracts
- [ ] Change SOLANA_RPC to mainnet
- [ ] Update treasury wallet if needed
- [ ] Test minting flow on mainnet-beta
- [ ] Set up royalty collection (recommended 5-10%)
- [ ] Configure secondary market royalties

### Smart Contract Requirements:

- [ ] SPL Token program deployed
- [ ] NFT metadata standard (Metaplex)
- [ ] Escrow/treasury program
- [ ] Royalty enforcement
- [ ] Transfer restrictions (if any)

### Legal & Compliance:

- [ ] Terms of Service for NFT sale
- [ ] Clear disclosure of rights granted
- [ ] Jurisdiction compliance check
- [ ] Tax reporting structure

## Scaling to 10,000 NFTs

**Current**: 5 images rotating
**Needed**: 9,995 more unique images

**Options**:
1. AI Generation (Midjourney/DALL-E)
2. Artist commission
3. Programmatic variations
4. Keep as exclusive small collection

## Treasury Wallet Security

⚠️ **IMPORTANT SECURITY NOTES**:

1. **Private Keys**: Never share private keys for `3AZNcE4Ms8zoRJRiPoAMwnyKJzbcqMSomtWRMXvkz8Qn`
2. **Multi-sig**: Consider using multi-sig wallet for mainnet
3. **Cold Storage**: Move funds to cold storage regularly
4. **Monitoring**: Set up alerts for large transactions
5. **Backup**: Maintain secure backup of seed phrase

## Support & Maintenance

### Monitoring Dashboard
- Check `/api/nft/stats` for mint statistics
- Monitor treasury wallet balance
- Track transaction confirmations
- Review failed mints

### Common Issues

**Issue**: Transaction fails
**Solution**: Check user has sufficient SOL + gas fees

**Issue**: Duplicate mints
**Solution**: Check database for unique token IDs

**Issue**: Image not loading
**Solution**: Verify image URLs are accessible

## Contact

For technical support or questions about the minting system, contact the development team.

---

**Last Updated**: December 2025
**Version**: 1.0.0
**Status**: Devnet Testing
