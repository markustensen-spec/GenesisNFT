import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Security code for wallet changes - DO NOT SHARE
const SECURITY_CODE = '2347'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { securityCode, newWalletAddress } = await request.json()
    
    // Verify security code
    if (securityCode !== SECURITY_CODE) {
      return NextResponse.json(
        { success: false, error: 'Invalid security code' },
        { status: 401 }
      )
    }
    
    // Validate Solana wallet address (base58, 32-44 chars)
    if (!newWalletAddress || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(newWalletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Solana wallet address' },
        { status: 400 }
      )
    }
    
    // Read current config
    const configPath = path.join(process.cwd(), 'lib', 'solana-config.js')
    let configContent = await fs.readFile(configPath, 'utf8')
    
    // Extract current wallet
    const currentMatch = configContent.match(/COLLECTION_WALLET:.*'([^']+)'/)
    const currentWallet = currentMatch ? currentMatch[1] : 'unknown'
    
    // Replace wallet address
    configContent = configContent.replace(
      /COLLECTION_WALLET:.*\|\|.*'[^']+'/,
      `COLLECTION_WALLET: process.env.NEXT_PUBLIC_COLLECTION_WALLET || '${newWalletAddress}'`
    )
    
    // Write updated config
    await fs.writeFile(configPath, configContent, 'utf8')
    
    // Log the change for audit
    console.log(`[WALLET CHANGE] ${new Date().toISOString()} - Changed from ${currentWallet} to ${newWalletAddress}`)
    
    return NextResponse.json({
      success: true,
      message: 'Wallet address updated successfully',
      previousWallet: currentWallet,
      newWallet: newWalletAddress,
      note: 'Redeploy required for changes to take effect on production'
    })
    
  } catch (error) {
    console.error('Wallet update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update wallet address' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const securityCode = searchParams.get('code')
    
    // Verify security code
    if (securityCode !== SECURITY_CODE) {
      return NextResponse.json(
        { success: false, error: 'Invalid security code' },
        { status: 401 }
      )
    }
    
    // Read current config
    const configPath = path.join(process.cwd(), 'lib', 'solana-config.js')
    const configContent = await fs.readFile(configPath, 'utf8')
    
    // Extract current wallet
    const currentMatch = configContent.match(/COLLECTION_WALLET:.*'([^']+)'/)
    const currentWallet = currentMatch ? currentMatch[1] : 'unknown'
    
    return NextResponse.json({
      success: true,
      currentWallet,
      message: 'Use POST with securityCode and newWalletAddress to change'
    })
    
  } catch (error) {
    console.error('Error reading wallet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to read wallet address' },
      { status: 500 }
    )
  }
}
