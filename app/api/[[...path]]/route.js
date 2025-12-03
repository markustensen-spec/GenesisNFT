import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

let client
let db

async function connectDB() {
  if (!db) {
    // Only create client when actually needed (runtime)
    if (!client) {
      const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017'
      client = new MongoClient(mongoUrl)
    }
    await client.connect()
    db = client.db(process.env.DB_NAME || 'genesishq_db')
  }
  return db
}

// Root endpoint
export async function GET(request) {
  const url = new URL(request.url)
  const path = url.pathname.replace('/api', '') || '/'

  // Root API endpoint
  if (path === '/') {
    return NextResponse.json({
      success: true,
      message: 'GenesisHQ API - Where Renaissance Meets Revolution',
      version: '1.0.0',
      endpoints: [
        '/api/prices - Get crypto prices',
        '/api/nft/mint - Mint NFT',
        '/api/whitelist - Join whitelist',
        '/api/game/leaderboard - Game leaderboard',
        '/api/auth/register - Register user',
        '/api/auth/login - Login user'
      ]
    })
  }

  // Get crypto prices from CoinGecko
  if (path === '/prices') {
    try {
      const coins = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot', 'avalanche-2']
      const coinsParam = coins.join(',')
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinsParam}&order=market_cap_desc&sparkline=false`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      const data = await response.json()
      
      return NextResponse.json({
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error fetching prices:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          data: [
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 45000, price_change_percentage_24h: 2.5, price_change_24h: 1125 },
            { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3200, price_change_percentage_24h: -1.2, price_change_24h: -38.4 },
            { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 98, price_change_percentage_24h: 5.7, price_change_24h: 5.58 },
          ]
        },
        { status: 200 }
      )
    }
  }

  // Game leaderboard
  if (path === '/game/leaderboard') {
    try {
      const database = await connectDB()
      const leaderboard = await database
        .collection('leaderboard')
        .find({})
        .sort({ score: -1 })
        .limit(10)
        .toArray()

      return NextResponse.json({
        success: true,
        data: leaderboard
      })
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { success: false, error: 'Endpoint not found' },
    { status: 404 }
  )
}

export async function POST(request) {
  const url = new URL(request.url)
  const path = url.pathname.replace('/api', '')
  
  try {
    const body = await request.json()

    // User Registration
    if (path === '/auth/register') {
      const { email, password, username } = body
      
      if (!email || !password || !username) {
        return NextResponse.json(
          { success: false, error: 'Email, password, and username required' },
          { status: 400 }
        )
      }

      const database = await connectDB()
      
      // Check if user exists
      const existingUser = await database.collection('users').findOne({ email })
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'User already exists' },
          { status: 400 }
        )
      }

      const userId = uuidv4()
      const user = {
        id: userId,
        email,
        username,
        password, // In production, hash this!
        createdAt: new Date(),
        walletAddress: null
      }
      
      await database.collection('users').insertOne(user)

      return NextResponse.json({
        success: true,
        user: { id: userId, email, username }
      })
    }

    // User Login
    if (path === '/auth/login') {
      const { email, password } = body
      
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: 'Email and password required' },
          { status: 400 }
        )
      }

      const database = await connectDB()
      const user = await database.collection('users').findOne({ email, password })
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, username: user.username }
      })
    }

    // NFT Minting
    if (path === '/nft/mint') {
      const { walletAddress, userId } = body
      
      if (!walletAddress) {
        return NextResponse.json(
          { success: false, error: 'Wallet address required' },
          { status: 400 }
        )
      }

      const mintId = uuidv4()
      const database = await connectDB()
      
      await database.collection('nft_mints').insertOne({
        id: mintId,
        userId: userId || null,
        walletAddress,
        collection: 'Leonardo da Vinci',
        tokenId: Math.floor(Math.random() * 10000) + 1,
        timestamp: new Date(),
        network: 'devnet',
        status: 'mocked'
      })

      return NextResponse.json({
        success: true,
        mintId,
        message: 'NFT minted successfully (mock)',
        note: 'This is a testnet simulation. Real minting requires Solana program deployment.'
      })
    }

    // Whitelist registration
    if (path === '/whitelist') {
      const { email, walletAddress } = body
      
      if (!email) {
        return NextResponse.json(
          { success: false, error: 'Email required' },
          { status: 400 }
        )
      }

      const database = await connectDB()
      const whitelistId = uuidv4()
      
      await database.collection('whitelist').insertOne({
        id: whitelistId,
        email,
        walletAddress: walletAddress || null,
        timestamp: new Date(),
        status: 'active'
      })

      return NextResponse.json({
        success: true,
        id: whitelistId,
        message: 'Successfully added to whitelist'
      })
    }

    // Game score submission
    if (path === '/game/score') {
      const { walletAddress, score, username } = body
      
      const database = await connectDB()
      
      await database.collection('leaderboard').updateOne(
        { walletAddress },
        { 
          $set: { 
            walletAddress,
            username: username || 'Anonymous',
            score,
            lastUpdated: new Date()
          }
        },
        { upsert: true }
      )

      return NextResponse.json({
        success: true,
        message: 'Score updated'
      })
    }

    // Create NFT mint transaction
    if (path === '/nft/create-mint') {
      const { walletAddress } = body
      
      if (!walletAddress) {
        return NextResponse.json(
          { success: false, error: 'Wallet address required' },
          { status: 400 }
        )
      }

      // Treasury wallet for receiving payments
      const TREASURY_WALLET = '3AZNcE4Ms8zoRJRiPoAMwnyKJzbcqMSomtWRMXvkz8Qn'
      const MINT_PRICE_SOL = 100

      return NextResponse.json({
        success: true,
        treasury: TREASURY_WALLET,
        amount: MINT_PRICE_SOL,
        message: 'Send 100 SOL to mint NFT',
        instructions: 'Please send payment to treasury wallet and then confirm mint'
      })
    }

    // Confirm NFT mint after payment
    if (path === '/nft/confirm-mint') {
      const { walletAddress, txSignature } = body
      
      if (!walletAddress || !txSignature) {
        return NextResponse.json(
          { success: false, error: 'Wallet address and transaction signature required' },
          { status: 400 }
        )
      }

      const database = await connectDB()
      
      // Get next token ID
      const mintCount = await database.collection('nft_mints').countDocuments()
      const tokenId = mintCount

      // Italian names for NFTs
      const italianNames = [
        'Anatomia del Corpo', 'Studio delle Membra', 'Codice Muscolare', 
        'Disegno Anatomico', 'Corpo Umano', 'Sistema Muscolare',
        'Struttura Ossea', 'Venature Profonde', 'Meccanica del Movimento',
        'Proporzioni Divine'
      ]

      const nftImages = [
        'https://customer-assets.emergentagent.com/job_genesishq/artifacts/e8vx47cp_grok_image_sidn9a.jpg',
        'https://customer-assets.emergentagent.com/job_genesishq/artifacts/8bolikx2_grok_image_xwwjcmi-1.jpg',
        'https://customer-assets.emergentagent.com/job_genesishq/artifacts/dsa5mpph_grok_image_srmrao.jpg',
        'https://customer-assets.emergentagent.com/job_genesishq/artifacts/z8mdzpxa_grok_image_7l8qdo.jpg',
        'https://customer-assets.emergentagent.com/job_genesishq/artifacts/rqwrdsfj_grok_image_srmrao-1.jpg',
      ]

      const imageIndex = tokenId % nftImages.length
      const nameIndex = tokenId % italianNames.length

      const nftData = {
        id: uuidv4(),
        tokenId,
        name: `${italianNames[nameIndex]} #${String(tokenId + 1).padStart(4, '0')}`,
        image: nftImages[imageIndex],
        walletAddress,
        txSignature,
        collection: 'Leonardo da Vinci Codex',
        mintPrice: 100,
        timestamp: new Date(),
        network: 'devnet',
        status: 'minted'
      }

      await database.collection('nft_mints').insertOne(nftData)

      return NextResponse.json({
        success: true,
        nft: nftData,
        message: 'NFT minted successfully!',
        explorer: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`
      })
    }

    return NextResponse.json(
      { success: false, error: 'Endpoint not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
