// Leonardo da Vinci NFT Collection
// 10,000 unique pieces with Italian names

export const nftImages = [
  'https://customer-assets.emergentagent.com/job_next-web3-platform/artifacts/g4hrw1bm_grok_image_srmrao-1.jpg',
  'https://customer-assets.emergentagent.com/job_next-web3-platform/artifacts/y5hjq0bz_grok_image_xwwjcmi.jpg',
  'https://customer-assets.emergentagent.com/job_next-web3-platform/artifacts/mockide6_grok_image_7l8qdo-1.jpg',
  'https://customer-assets.emergentagent.com/job_next-web3-platform/artifacts/jtesetoj_grok_image_sidn9a.jpg',
  'https://customer-assets.emergentagent.com/job_next-web3-platform/artifacts/gcvlk6hh_grok_image_5slpa7-2.jpg',
];

// Blank/Mystery pages for fun (surprise NFTs)
export const blankPageImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2Y1ZTZkMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2VyaWYiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IiM4YjczNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QYWdpbmEgVnVvdGE8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzhiNzM1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPihCbGFuayBQYWdlKTwvdGV4dD48L3N2Zz4=';

// Ultra-rare Leonardo da Vinci Exclusive NFTs (10 total: 5 of each design)
export const leonardoExclusiveImages = [
  'https://customer-assets.emergentagent.com/job_genesishq-web3/artifacts/xz22jrcq_Leonardo_da_Vinci_-_presumed_self-portrait_-_WGA12798.jpg', // Exclusives #9991-9995
  'https://customer-assets.emergentagent.com/job_genesishq-web3/artifacts/gy866af7_images%20%281%29.jpeg' // Exclusives #9996-10000
];

// Leonardo Selfie with $5,000 prize (1 of 1)
export const leonardoSelfieImage = 'https://customer-assets.emergentagent.com/job_genesishq-web3/artifacts/6wmd6e2c_1000004282.jpg.png';

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

// Generate metadata for 10,000 NFTs (9,989 Codex Sketches + 1 Leonardo Selfie + 10 Leonardo Exclusives)
export function generateNFTMetadata(tokenId) {
  // Leonardo da Vinci Selfie with $5,000 Prize (Token ID 9989)
  if (tokenId === 9989) {
    return {
      name: `Leonardo da Vinci Selfie #9990`,
      description: `EPIC 1 of 1: The legendary Leonardo da Vinci Selfie! Winner of this NFT receives &#36;5,000 USD prize. This is an ultra-rare masterpiece representing the genius himself, granting ultimate status and lifetime privileges in the Codex Collective.`,
      image: leonardoSelfieImage,
      external_url: 'https://next-web3-platform.preview.emergentagent.com',
      attributes: [
        {
          trait_type: 'Collection',
          value: 'Leonardo da Vinci Codex'
        },
        {
          trait_type: 'Type',
          value: 'LEONARDO SELFIE'
        },
        {
          trait_type: 'Rarity',
          value: 'EPIC'
        },
        {
          trait_type: 'Prize',
          value: '&#36;5,000 USD'
        },
        {
          trait_type: 'Edition',
          value: '1 of 1'
        },
        {
          trait_type: 'Benefits',
          value: 'Ultimate Privileges + &#36;5K Prize'
        }
      ],
      seller_fee_basis_points: 1500, // 15% royalty
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
  
  // Ultra-rare Leonardo da Vinci Exclusive NFTs (Token IDs 9990-9999)
  if (tokenId >= 9990) {
    const exclusiveNumber = tokenId - 9989; // 1-10
    const imageIndex = tokenId < 9995 ? 0 : 1; // First 5 use image 0, last 5 use image 1
    const editionNumber = tokenId < 9995 ? (tokenId - 9989) : (tokenId - 9994); // 1-5 for each
    
    return {
      name: `Leonardo da Vinci Exclusive #${String(tokenId + 1).padStart(5, '0')}`,
      description: `ULTRA-RARE: One of only 10 Leonardo da Vinci Exclusive NFTs in the entire collection. This legendary piece represents the master himself, granting ultimate status and lifetime privileges in the Codex Collective. Edition ${editionNumber} of 5.`,
      image: leonardoExclusiveImages[imageIndex],
      external_url: 'https://next-web3-platform.preview.emergentagent.com',
      attributes: [
        {
          trait_type: 'Collection',
          value: 'Leonardo da Vinci Codex'
        },
        {
          trait_type: 'Type',
          value: 'ULTRA-RARE EXCLUSIVE'
        },
        {
          trait_type: 'Rarity',
          value: 'LEGENDARY'
        },
        {
          trait_type: 'Edition',
          value: `${editionNumber} of 5`
        },
        {
          trait_type: 'Series',
          value: imageIndex === 0 ? 'Classic Portrait' : 'Renaissance Master'
        },
        {
          trait_type: 'Benefits',
          value: 'Ultimate Privileges & Supreme Status'
        }
      ],
      seller_fee_basis_points: 1500, // 15% royalty
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
  
  // Regular Codex Sketch NFTs (0-9988)
  // 1% chance of getting a fun blank page (Mystery NFT)
  const isBlankPage = (tokenId * 137) % 100 < 1; // ~1% chance
  
  if (isBlankPage) {
    return {
      name: `Pagina Vuota #${String(tokenId + 1).padStart(4, '0')}`,
      description: `MYSTERY: A rare blank page from Leonardo's Codex! Legend says these empty pages hold hidden messages only visible to true collectors. Perhaps Leonardo left them blank on purpose... or did he? This ultra-rare find grants you bragging rights and mysterious powers within the Codex Collective.`,
      image: blankPageImage,
      external_url: 'https://next-web3-platform.preview.emergentagent.com',
      attributes: [
        {
          trait_type: 'Collection',
          value: 'Leonardo da Vinci Codex'
        },
        {
          trait_type: 'Type',
          value: 'MYSTERY - Blank Page'
        },
        {
          trait_type: 'Rarity',
          value: 'ULTRA RARE'
        },
        {
          trait_type: 'Mystery Level',
          value: 'Maximum'
        },
        {
          trait_type: 'Hidden Content',
          value: '???'
        },
        {
          trait_type: 'Benefits',
          value: 'Mystery Powers + Bragging Rights'
        }
      ],
      seller_fee_basis_points: 1500, // 15% royalty
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
  
  // Use pseudo-random selection based on tokenId for more variety
  const imageHash = (tokenId * 2654435761) % nftImages.length;
  const imageIndex = Math.abs(imageHash);
  
  const nameHash = (tokenId * 1103515245 + 12345) % italianNames.length;
  const nameIndex = Math.abs(nameHash);
  
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const rarityHash = (tokenId * 48271) % rarities.length;
  const rarityIndex = Math.abs(rarityHash);
  
  return {
    name: `${italianNames[nameIndex]} #${String(tokenId + 1).padStart(4, '0')}`,
    description: `Part of the Leonardo da Vinci Codex Collection - one of 9,989 unique Codex Sketches. An authentic Renaissance anatomical study combining art and science. This NFT grants lifetime voting rights in the Codex Collective and enhanced $CAX staking rewards.`,
    image: nftImages[imageIndex],
    external_url: 'https://next-web3-platform.preview.emergentagent.com',
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
        value: ['Anatomical', 'Muscular', 'Skeletal', 'Vascular', 'Mixed'][imageIndex % 5]
      },
      {
        trait_type: 'Benefits',
        value: 'Lifetime Codex Voting Rights'
      }
    ],
    seller_fee_basis_points: 1500, // 15% royalty
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
  description: '9,989 unique Codex Sketches + 1 Epic Leonardo Selfie (&#36;5,000 prize) + 10 ultra-rare Leonardo da Vinci Exclusives. Renaissance genius meets blockchain innovation.',
  totalSupply: 10000,
  codexSketches: 9989,
  leonardoSelfie: 1,
  leonardoExclusives: 10,
  mintPrice: MINT_PRICE_USD,
  mintPriceDisplay: '&#36;100 USD',
  network: 'Solana Devnet',
  prize: '&#36;5,000 USD for Leonardo Selfie winner',
  benefits: [
    'Permanent voting rights in Codex Collective',
    'Lifetime access to exclusive community',
    'Enhanced $CAX staking rewards',
    'Priority access to future drops',
    'Chance to win &#36;5,000 prize (Leonardo Selfie)',
    'Exclusive status and recognition'
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
