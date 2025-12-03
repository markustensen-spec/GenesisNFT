// Solana NFT Minting System
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Treasury wallet for receiving mint payments
export const TREASURY_WALLET = '3AZNcE4Ms8zoRJRiPoAMwnyKJzbcqMSomtWRMXvkz8Qn';

// Mint price in SOL
export const MINT_PRICE_SOL = 100;
export const MINT_PRICE_LAMPORTS = MINT_PRICE_SOL * LAMPORTS_PER_SOL;

// Solana devnet connection
export const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

// Initialize Solana connection
export function getSolanaConnection() {
  return new Connection(SOLANA_RPC, 'confirmed');
}

// Create mint transaction
export async function createMintTransaction(userWalletAddress) {
  try {
    const connection = getSolanaConnection();
    const userPublicKey = new PublicKey(userWalletAddress);
    const treasuryPublicKey = new PublicKey(TREASURY_WALLET);

    // Create transaction to transfer SOL from user to treasury
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: userPublicKey,
        toPubkey: treasuryPublicKey,
        lamports: MINT_PRICE_LAMPORTS,
      })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPublicKey;

    return {
      success: true,
      transaction: transaction.serialize({ requireAllSignatures: false }).toString('base64'),
      amount: MINT_PRICE_SOL,
      treasury: TREASURY_WALLET
    };
  } catch (error) {
    console.error('Error creating mint transaction:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Verify mint transaction
export async function verifyMintTransaction(signature) {
  try {
    const connection = getSolanaConnection();
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    return {
      success: !confirmation.value.err,
      signature,
      confirmed: true
    };
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get NFT metadata for minted token
export function getNFTMetadata(tokenId, txSignature) {
  const nftImages = [
    'https://customer-assets.emergentagent.com/job_genesishq/artifacts/e8vx47cp_grok_image_sidn9a.jpg',
    'https://customer-assets.emergentagent.com/job_genesishq/artifacts/8bolikx2_grok_image_xwwjcmi-1.jpg',
    'https://customer-assets.emergentagent.com/job_genesishq/artifacts/dsa5mpph_grok_image_srmrao.jpg',
    'https://customer-assets.emergentagent.com/job_genesishq/artifacts/z8mdzpxa_grok_image_7l8qdo.jpg',
    'https://customer-assets.emergentagent.com/job_genesishq/artifacts/rqwrdsfj_grok_image_srmrao-1.jpg',
  ];

  const italianNames = [
    'Anatomia del Corpo', 'Studio delle Membra', 'Codice Muscolare', 
    'Disegno Anatomico', 'Corpo Umano', 'Sistema Muscolare', 
    'Struttura Ossea', 'Venature Profonde', 'Meccanica del Movimento', 
    'Proporzioni Divine'
  ];

  const imageIndex = tokenId % nftImages.length;
  const nameIndex = tokenId % italianNames.length;

  return {
    name: `${italianNames[nameIndex]} #${String(tokenId + 1).padStart(4, '0')}`,
    description: 'Leonardo da Vinci Codex Collection - Renaissance anatomical study with lifetime Codex Collective voting rights',
    image: nftImages[imageIndex],
    attributes: [
      { trait_type: 'Collection', value: 'Leonardo da Vinci Codex' },
      { trait_type: 'Type', value: tokenId < 10 ? 'Original' : 'Generative' },
      { trait_type: 'Transaction', value: txSignature }
    ]
  };
}
