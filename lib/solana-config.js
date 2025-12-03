/**
 * Solana Configuration for GenesisHQ
 * Lazy minting setup
 */

export const SOLANA_CONFIG = {
  // Network
  NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
  RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
  
  // Collection wallet (provided by user)
  COLLECTION_WALLET: 'uG8asasuaHPTJwypsuS2xaAychFQU5ZaiE5VPpAFsoh',
  
  // NFT Collection details
  COLLECTION: {
    name: 'Leonardo da Vinci Collection',
    symbol: 'CODEX',
    description: 'Leonardo da Vinci\'s genius on Solana blockchain. 10,000 unique Renaissance masterpieces.',
    totalSupply: 10000,
    royaltyBasisPoints: 1500, // 15%
    price: 0.5, // SOL per mint
  },
  
  // NFT Tiers
  TIERS: {
    COMMON: {
      name: 'Codex Sketch',
      range: [1, 9989],
      count: 9989,
      rarity: 'Common'
    },
    EXCLUSIVE: {
      name: 'Leonardo Exclusive',
      range: [9990, 9999],
      count: 10,
      rarity: 'Legendary'
    },
    EPIC: {
      name: 'Epic Leonardo Selfie',
      range: [10000, 10000],
      count: 1,
      rarity: 'Epic',
      prize: 5000 // $5000 prize
    }
  },
  
  // Metadata
  BASE_URI: process.env.NEXT_PUBLIC_NFT_BASE_URI || 'https://genesishq.io/api/nft/metadata',
}

/**
 * Get tier for a given NFT number
 */
export function getNFTTier(nftNumber) {
  if (nftNumber >= 1 && nftNumber <= 9989) return SOLANA_CONFIG.TIERS.COMMON
  if (nftNumber >= 9990 && nftNumber <= 9999) return SOLANA_CONFIG.TIERS.EXCLUSIVE
  if (nftNumber === 10000) return SOLANA_CONFIG.TIERS.EPIC
  return null
}

/**
 * Generate random attributes based on tier
 */
export function generateAttributes(tier, nftNumber) {
  const attributes = [
    { trait_type: 'Rarity', value: tier.rarity },
    { trait_type: 'Number', value: nftNumber.toString() },
    { trait_type: 'Era', value: 'Renaissance' }
  ]
  
  if (tier.rarity === 'Common') {
    const backgrounds = ['Parchment', 'Canvas', 'Wood Panel', 'Stone']
    const types = ['Anatomy Study', 'Invention Sketch', 'Portrait Study', 'Nature Study']
    const styles = ['Ink', 'Charcoal', 'Silverpoint', 'Red Chalk']
    
    attributes.push(
      { trait_type: 'Background', value: backgrounds[Math.floor(Math.random() * backgrounds.length)] },
      { trait_type: 'Sketch Type', value: types[Math.floor(Math.random() * types.length)] },
      { trait_type: 'Style', value: styles[Math.floor(Math.random() * styles.length)] }
    )
  } else if (tier.rarity === 'Legendary') {
    attributes.push(
      { trait_type: 'Masterpiece', value: 'Original' },
      { trait_type: 'Frame', value: 'Gold Gilded' },
      { trait_type: 'Authentication', value: 'Verified' }
    )
  } else if (tier.rarity === 'Epic') {
    attributes.push(
      { trait_type: 'Prize', value: '$5,000' },
      { trait_type: 'Uniqueness', value: '1 of 1' },
      { trait_type: 'Status', value: 'Epic' }
    )
  }
  
  return attributes
}
