/**
 * Solana Configuration for GenesisHQ
 * Production ready - Mainnet
 */

export const SOLANA_CONFIG = {
  // Network - Mainnet
  NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
  RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  
  // Collection wallet
  COLLECTION_WALLET: process.env.NEXT_PUBLIC_COLLECTION_WALLET || 'uG8asasuaHPTJwypsuS2xaAychFQU5ZaiE5VPpAFsoh',
  
  // NFT Collection
  COLLECTION: {
    name: 'Leonardo da Vinci Collection',
    symbol: 'DAVINCI',
    description: '500 Founders + 9,500 Sketches',
    totalSupply: 10000,
    royaltyBasisPoints: 1500,
    price: 0.5,
  },
  
  // Metadata base URL - uses current domain
  BASE_URI: typeof window !== 'undefined' 
    ? `${window.location.origin}/api/nft/metadata`
    : process.env.NEXT_PUBLIC_BASE_URL 
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/nft/metadata`
      : 'https://genesishq.io/api/nft/metadata',
}

/**
 * Get tier for a given NFT number
 */
export function getNFTTier(nftNumber) {
  if (nftNumber >= 1 && nftNumber <= 500) return 'FOUNDER'
  return 'SKETCH'
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
