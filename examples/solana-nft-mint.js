/**
 * Solana NFT Minting Logic
 * Uses Metaplex Candy Machine for minting
 */

import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Metaplex, walletAdapterIdentity, keypairIdentity } from '@metaplex-foundation/js'

/**
 * Mint an NFT from the Candy Machine
 * @param {Connection} connection - Solana connection
 * @param {PublicKey} walletPublicKey - User's wallet public key
 * @param {string} candyMachineAddress - Candy Machine ID
 * @param {string} collectionAddress - Collection NFT address
 * @returns {Promise<Object>} Minted NFT data
 */
export async function mintNFT(
  connection,
  walletPublicKey,
  candyMachineAddress,
  collectionAddress
) {
  try {
    // Initialize Metaplex
    const metaplex = Metaplex.make(connection)
      .use(walletAdapterIdentity(window.solana)) // Use Phantom/Solflare wallet

    // Load Candy Machine
    const candyMachine = await metaplex
      .candyMachines()
      .findByAddress({ address: new PublicKey(candyMachineAddress) })

    console.log('Candy Machine loaded:', candyMachine)

    // Check if candy machine is live
    if (!candyMachine.candyGuard) {
      throw new Error('Candy Machine not yet live')
    }

    // Mint NFT
    const { nft } = await metaplex
      .candyMachines()
      .mint({
        candyMachine,
        collectionUpdateAuthority: new PublicKey(collectionAddress),
      })

    console.log('NFT Minted:', nft)

    return {
      mint: nft.address.toString(),
      name: nft.name,
      image: nft.json?.image || '',
      attributes: nft.json?.attributes || [],
      uri: nft.uri
    }
  } catch (error) {
    console.error('Minting error:', error)
    
    // Handle specific errors
    if (error.message.includes('insufficient funds')) {
      throw new Error('Insufficient SOL balance. Please add funds to your wallet.')
    }
    
    if (error.message.includes('sold out')) {
      throw new Error('NFT collection is sold out.')
    }
    
    if (error.message.includes('not yet live')) {
      throw new Error('Minting is not yet live. Please wait for the launch.')
    }
    
    throw error
  }
}

/**
 * Get Candy Machine stats
 * @param {Connection} connection - Solana connection
 * @param {string} candyMachineAddress - Candy Machine ID
 * @returns {Promise<Object>} Candy Machine stats
 */
export async function getCandyMachineStats(connection, candyMachineAddress) {
  try {
    const metaplex = Metaplex.make(connection)

    const candyMachine = await metaplex
      .candyMachines()
      .findByAddress({ address: new PublicKey(candyMachineAddress) })

    return {
      totalSupply: candyMachine.itemsAvailable.toNumber(),
      minted: candyMachine.itemsMinted.toNumber(),
      price: candyMachine.candyGuard?.guards?.solPayment?.amount.basisPoints.toNumber() / LAMPORTS_PER_SOL || 0,
      goLiveDate: candyMachine.candyGuard?.guards?.startDate?.date || null,
      isLive: Date.now() >= (candyMachine.candyGuard?.guards?.startDate?.date?.toNumber() * 1000 || 0)
    }
  } catch (error) {
    console.error('Failed to fetch candy machine stats:', error)
    throw error
  }
}

/**
 * Check if user owns any NFTs from the collection
 * @param {Connection} connection - Solana connection
 * @param {PublicKey} walletPublicKey - User's wallet public key
 * @param {string} collectionAddress - Collection NFT address
 * @returns {Promise<Array>} User's NFTs from collection
 */
export async function getUserNFTs(connection, walletPublicKey, collectionAddress) {
  try {
    const metaplex = Metaplex.make(connection)

    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: walletPublicKey })

    // Filter by collection
    const collectionNFTs = nfts.filter(
      nft => nft.collection?.address.toString() === collectionAddress
    )

    return collectionNFTs.map(nft => ({
      mint: nft.address.toString(),
      name: nft.name,
      image: nft.json?.image || '',
      attributes: nft.json?.attributes || []
    }))
  } catch (error) {
    console.error('Failed to fetch user NFTs:', error)
    return []
  }
}
