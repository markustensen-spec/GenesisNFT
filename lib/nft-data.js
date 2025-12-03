// Leonardo da Vinci NFT Collection
// 10,000 unique pieces with Italian names

export const nftImages = [
  'https://customer-assets.emergentagent.com/job_genesishq/artifacts/e8vx47cp_grok_image_sidn9a.jpg',
  'https://customer-assets.emergentagent.com/job_genesishq/artifacts/8bolikx2_grok_image_xwwjcmi-1.jpg',
  'https://customer-assets.emergentagent.com/job_genesishq/artifacts/dsa5mpph_grok_image_srmrao.jpg',
  'https://customer-assets.emergentagent.com/job_genesishq/artifacts/z8mdzpxa_grok_image_7l8qdo.jpg',
  'https://customer-assets.emergentagent.com/job_genesishq/artifacts/rqwrdsfj_grok_image_srmrao-1.jpg',
];

// Ultra-rare Leonardo da Vinci Exclusive NFTs (10 total: 5 of each design)
export const leonardoExclusiveImages = [
  'https://customer-assets.emergentagent.com/job_genesishq-web3/artifacts/xz22jrcq_Leonardo_da_Vinci_-_presumed_self-portrait_-_WGA12798.jpg', // Exclusives #9991-9995
  'https://customer-assets.emergentagent.com/job_genesishq-web3/artifacts/gy866af7_images%20%281%29.jpeg' // Exclusives #9996-10000
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

// Generate metadata for 10,000 NFTs (9,999 Codex Sketches + 1 Leonardo Selfie)
export function generateNFTMetadata(tokenId) {
  // Ultra-rare Leonardo Selfie NFT (Token ID 9999)
  if (tokenId === 9999) {
    return {
      name: 'Leonardo da Vinci Selfie #10000',
      description: 'ULTRA-RARE 1 of 1: The legendary Leonardo da Vinci selfie. Winner of this NFT receives $50,000 USD prize once the collection sells out! This is the crown jewel of the entire Codex Collection, granting ultimate status and lifetime privileges.',
      image: leonardoSelfieImage,
      external_url: 'https://genesishq-web3.preview.emergentagent.com',
      attributes: [
        {
          trait_type: 'Collection',
          value: 'Leonardo da Vinci Codex'
        },
        {
          trait_type: 'Type',
          value: 'ULTRA-RARE SELFIE'
        },
        {
          trait_type: 'Rarity',
          value: '1 of 1 LEGENDARY'
        },
        {
          trait_type: 'Prize',
          value: '$50,000 USD'
        },
        {
          trait_type: 'Benefits',
          value: 'Ultimate Privileges + $50K Prize'
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
  
  // Regular Codex Sketch NFTs (0-9998)
  const imageIndex = tokenId % nftImages.length;
  const nameIndex = Math.floor(tokenId / nftImages.length) % italianNames.length;
  
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const rarityIndex = tokenId % rarities.length;
  
  return {
    name: `${italianNames[nameIndex]} #${String(tokenId + 1).padStart(4, '0')}`,
    description: `Part of the Leonardo da Vinci Codex Collection - one of 9,999 unique Codex Sketches. An authentic Renaissance anatomical study combining art and science. This NFT grants lifetime voting rights in the Codex Collective and enhanced $CAX staking rewards.`,
    image: nftImages[imageIndex],
    external_url: 'https://genesishq-web3.preview.emergentagent.com',
    attributes: [
      {
        trait_type: 'Collection',
        value: 'Leonardo da Vinci Codex'
      },
      {
        trait_type: 'Type',
        value: 'Codex Sketch'
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

// Mint price in USD
export const MINT_PRICE_USD = 100;
export const MINT_PRICE_SOL = 0; // Price calculated at time of mint based on SOL/USD rate

// Collection info
export const COLLECTION_INFO = {
  name: 'Leonardo da Vinci Codex',
  symbol: 'DAVINCI',
  description: '9,999 unique Codex Sketches + 1 ultra-rare Leonardo Selfie. Renaissance genius meets blockchain innovation.',
  totalSupply: 10000,
  codexSketches: 9999,
  leonardoSelfie: 1,
  mintPrice: MINT_PRICE_USD,
  mintPriceDisplay: '$100 USD',
  network: 'Solana Devnet',
  prize: '$50,000 USD awarded to Leonardo Selfie winner once mint sells out',
  benefits: [
    'Permanent voting rights in Codex Collective',
    'Lifetime access to exclusive community',
    'Enhanced $CAX staking rewards',
    'Priority access to future drops',
    'Chance to win $50,000 prize (Leonardo Selfie)'
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
