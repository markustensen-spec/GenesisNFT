/**
 * Solana Configuration for Genesis Nexus7
 * Production ready - Mainnet
 */

export const SOLANA_CONFIG = {
  // Network - Mainnet
  NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
  RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  
  // Collection wallet
  COLLECTION_WALLET: process.env.NEXT_PUBLIC_COLLECTION_WALLET || '3QFhq4daxdFWsCwMy3J7PK3x4uPtAwqzDBECKVcaArBV',
  
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
