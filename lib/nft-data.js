// Leonardo da Vinci NFT Collection
// 10,000 unique pieces - 500 Founders + 9,500 Sketches

export const nftImages = [
  'https://customer-assets.emergentagent.com/job_next-web3-platform/artifacts/g4hrw1bm_grok_image_srmrao-1.jpg',
  'https://customer-assets.emergentagent.com/job_next-web3-platform/artifacts/y5hjq0bz_grok_image_xwwjcmi.jpg',
  'https://customer-assets.emergentagent.com/job_next-web3-platform/artifacts/mockide6_grok_image_7l8qdo-1.jpg',
  'https://customer-assets.emergentagent.com/job_next-web3-platform/artifacts/jtesetoj_grok_image_sidn9a.jpg',
  'https://customer-assets.emergentagent.com/job_next-web3-platform/artifacts/gcvlk6hh_grok_image_5slpa7-2.jpg',
];

// Vitruvian Man image for Founders NFTs
export const founderImage = 'https://customer-assets.emergentagent.com/job_d276f0f7-c89d-485a-afe5-73673e9f3f01/artifacts/19jx9ydj_Snapchat-2040080020.jpg';

// Italian names for the collection (Renaissance themed)
export const italianNames = [
  'Anatomia del Corpo', 'Studio delle Membra', 'Codice Muscolare', 'Disegno Anatomico',
  'Corpo Umano', 'Sistema Muscolare', 'Struttura Ossea', 'Venature Profonde',
  'Meccanica del Movimento', 'Proporzioni Divine', 'Figura Umana', 'Scheletro Maestro',
  'Muscoli del Torso', 'Volto Anatomico', 'Cranio e Cervello', 'Mani dell\'Artista',
  'Piedi e Gambe', 'Spalle e Braccia', 'Colonna Vertebrale', 'Sistema Nervoso',
  'Cuore e Polmoni', 'Organi Vitali', 'Sistema Digestivo', 'Circolazione Sanguigna',
  'Tendini e Legamenti', 'Articolazioni', 'Studio del Movimento', 'Postura Perfetta',
  'Equilibrio del Corpo', 'Forza Muscolare', 'Anatomia Comparata', 'Schizzi Medicali',
  'Dissezione Classica', 'Proporzioni Vitruviane', 'Geometria Corporea', 'Simmetria Umana',
  'Dettagli Muscolari', 'Struttura Scheletrica', 'Sistema Arterioso', 'Vene e Capillari',
  'Anatomia della Mano', 'Studio del Braccio', 'Meccanica della Gamba', 'Piede Umano',
  'Volto in Sezione', 'Cranio Frontale', 'Vista Laterale', 'Sezione Trasversale',
  'Muscolo Bicipite', 'Tricipite Brachiale', 'Deltoide e Spalla', 'Pettorale Maggiore',
  'Addominali Obliqui', 'Muscolo Retto', 'Quadricipite Femorale', 'Bicipite Femorale',
];

// Founder NFT IDs (first 500 NFTs are Founders)
export const FOUNDER_NFT_COUNT = 500;

// Generate metadata for 10,000 NFTs
// - Token 0-499: Founder NFTs (500 total) - Lifetime access, 8% bonus APY, airdrops
// - Token 500-9999: Codex Sketches (9,500 total) - Utility NFTs
export function generateNFTMetadata(tokenId) {
  // FOUNDER NFTs (Token IDs 0-499) - 500 total
  // Special traits: Lifetime access, 8% bonus APY, exclusive airdrops
  if (tokenId < FOUNDER_NFT_COUNT) {
    const founderNumber = tokenId + 1;
    
    return {
      name: `Vitruvian Founder #${String(founderNumber).padStart(3, '0')}`,
      description: `FOUNDER NFT: One of only 500 exclusive Vitruvian Founder NFTs! Holders receive LIFETIME ACCESS to all Genesis Nexus7 features, 8% BONUS APY on staking rewards, and exclusive AIRDROPS. This Leonardo da Vinci Vitruvian Man artwork represents the perfect blend of art, science, and blockchain innovation.`,
      image: founderImage,
      external_url: 'https://genesishq.io',
      attributes: [
        { trait_type: 'Collection', value: 'Leonardo da Vinci Codex' },
        { trait_type: 'Type', value: 'FOUNDER' },
        { trait_type: 'Rarity', value: 'RARE' },
        { trait_type: 'Edition', value: `${founderNumber} of 500` },
        { trait_type: 'Lifetime Access', value: 'Yes' },
        { trait_type: 'Bonus APY', value: '8%' },
        { trait_type: 'Airdrop Eligible', value: 'Yes' },
        { trait_type: 'Artwork', value: 'Vitruvian Man' },
        { trait_type: 'Benefits', value: 'Lifetime Access + 8% APY + Airdrops' }
      ],
      seller_fee_basis_points: 1500,
      properties: {
        category: 'image',
        creators: [{ address: 'Genesis Nexus7', share: 100 }]
      }
    };
  }
  
  // Regular Codex Sketch NFTs (500-9999) - 9,500 total
  // Utility NFTs with standard benefits
  const imageHash = (tokenId * 2654435761) % nftImages.length;
  const imageIndex = Math.abs(imageHash);
  
  const nameHash = (tokenId * 1103515245 + 12345) % italianNames.length;
  const nameIndex = Math.abs(nameHash);
  
  const rarities = ['Common', 'Uncommon', 'Rare'];
  const rarityHash = (tokenId * 48271) % rarities.length;
  const rarityIndex = Math.abs(rarityHash);
  
  return {
    name: `${italianNames[nameIndex]} #${String(tokenId + 1).padStart(4, '0')}`,
    description: `Part of the Leonardo da Vinci Codex Collection - one of 9,500 unique Codex Sketches. An authentic Renaissance anatomical study combining art and science. This UTILITY NFT grants voting rights in the Codex Collective and enhanced staking rewards.`,
    image: nftImages[imageIndex],
    external_url: 'https://genesishq.io',
    attributes: [
      { trait_type: 'Collection', value: 'Leonardo da Vinci Codex' },
      { trait_type: 'Type', value: 'Codex Sketch' },
      { trait_type: 'Rarity', value: rarities[rarityIndex] },
      { trait_type: 'Series', value: `Series ${Math.floor(tokenId / 1000) + 1}` },
      { trait_type: 'Study Type', value: ['Anatomical', 'Muscular', 'Skeletal', 'Vascular', 'Mixed'][imageIndex % 5] },
      { trait_type: 'Utility', value: 'Voting + Staking Rewards' },
      { trait_type: 'Benefits', value: 'Codex Voting Rights' }
    ],
    seller_fee_basis_points: 1500,
    properties: {
      category: 'image',
      creators: [{ address: 'Genesis Nexus7', share: 100 }]
    }
  };
}

// Mint price in SOL
export const MINT_PRICE_SOL = 0.5;

// Collection info
export const COLLECTION_INFO = {
  name: 'Leonardo da Vinci Codex',
  symbol: 'DAVINCI',
  description: '500 Founder NFTs (Lifetime access, 8% APY, Airdrops) + 9,500 Codex Sketches (Utility NFTs)',
  totalSupply: 10000,
  founderNFTs: 500,
  codexSketches: 9500,
  mintPrice: MINT_PRICE_SOL,
  mintPriceDisplay: `${MINT_PRICE_SOL} SOL`,
  network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
  founderBenefits: [
    'LIFETIME ACCESS to all features',
    '8% BONUS APY on staking',
    'Exclusive AIRDROPS',
    'Priority access to future drops',
    'Codex Collective VIP status'
  ],
  sketchBenefits: [
    'Voting rights in Codex Collective',
    'Standard staking rewards',
    'Community membership',
    'Access to minigames'
  ]
};

// Check if NFT is a Founder NFT
export function isFounderNFT(tokenId) {
  return tokenId < FOUNDER_NFT_COUNT;
}

// Get random unminted NFT
export function getRandomNFT(mintedIds = []) {
  const available = [];
  for (let i = 0; i < 10000; i++) {
    if (!mintedIds.includes(i)) {
      available.push(i);
    }
  }
  if (available.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}
