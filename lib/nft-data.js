// Leonardo da Vinci NFT Collection
// 10,000 unique pieces with Italian names

export const nftImages = [
  'https://customer-assets.emergentagent.com/job_genesishq/artifacts/e8vx47cp_grok_image_sidn9a.jpg',
  'https://customer-assets.emergentagent.com/job_genesishq/artifacts/8bolikx2_grok_image_xwwjcmi-1.jpg',
  'https://customer-assets.emergentagent.com/job_genesishq/artifacts/dsa5mpph_grok_image_srmrao.jpg',
  'https://customer-assets.emergentagent.com/job_genesishq/artifacts/z8mdzpxa_grok_image_7l8qdo.jpg',
  'https://customer-assets.emergentagent.com/job_genesishq/artifacts/rqwrdsfj_grok_image_srmrao-1.jpg',
];

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

// Generate metadata for 10,000 NFTs
export function generateNFTMetadata(tokenId) {
  const imageIndex = tokenId % nftImages.length;
  const nameIndex = Math.floor(tokenId / nftImages.length) % italianNames.length;
  const variation = Math.floor(tokenId / (nftImages.length * italianNames.length));
  
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const rarityIndex = tokenId % rarities.length;
  
  return {
    name: `${italianNames[nameIndex]} #${String(tokenId + 1).padStart(4, '0')}`,
    description: `Part of the Leonardo da Vinci Codex Collection. An authentic Renaissance anatomical study combining art and science. This NFT grants lifetime voting rights in the Codex Collective and enhanced $CAX staking rewards.`,
    image: nftImages[imageIndex],
    external_url: 'https://genesishq.preview.emergentagent.com',
    attributes: [
      {
        trait_type: 'Collection',
        value: 'Leonardo da Vinci Codex'
      },
      {
        trait_type: 'Type',
        value: tokenId < 10 ? 'Original' : 'Generative'
      },
      {
        trait_type: 'Rarity',
        value: rarities[rarityIndex]
      },
      {
        trait_type: 'Series',
        value: `Series ${Math.floor(tokenId / 1000) + 1}`
      },
      {
        trait_type: 'Study Type',
        value: ['Anatomical', 'Muscular', 'Skeletal', 'Vascular', 'Mechanical'][imageIndex]
      },
      {
        trait_type: 'Benefits',
        value: 'Lifetime Codex Voting Rights'
      }
    ],
    properties: {
      category: 'image',
      creators: [
        {
          address: 'GenesisHQ',
          share: 100
        }
      ]
    }
  };
}

// Mint price in SOL
export const MINT_PRICE_SOL = 100;
export const MINT_PRICE_USD = 100;

// Collection info
export const COLLECTION_INFO = {
  name: 'Leonardo da Vinci Codex',
  symbol: 'DAVINCI',
  description: 'A collection of 10,000 Renaissance anatomical studies combining Leonardo da Vinci\'s genius with blockchain technology.',
  totalSupply: 10000,
  originalPieces: 10,
  generativePieces: 9990,
  mintPrice: MINT_PRICE_SOL,
  network: 'Solana Devnet',
  benefits: [
    'Permanent voting rights in Codex Collective',
    'Lifetime access to exclusive community',
    'Enhanced $CAX staking rewards',
    'Priority access to future drops'
  ]
};

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
