/**
 * NFT Minting Component for GenesisHQ
 * Integrates with Solana blockchain and Metaplex Candy Machine
 */

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Wallet as WalletIcon, CheckCircle } from 'lucide-react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { mintNFT } from './solana-nft-mint'

export default function NFTMinting({ collectionAddress, candyMachineAddress }) {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const [minting, setMinting] = useState(false)
  const [mintedNFT, setMintedNFT] = useState(null)
  const [error, setError] = useState('')
  const [collectionInfo, setCollectionInfo] = useState({
    totalSupply: 10000,
    minted: 0,
    price: 0.5 // SOL
  })

  // Fetch collection stats
  useEffect(() => {
    if (connected && candyMachineAddress) {
      fetchCollectionStats()
    }
  }, [connected, candyMachineAddress])

  const fetchCollectionStats = async () => {
    try {
      // TODO: Implement actual candy machine data fetching
      // This would query the candy machine account
      // For now using mock data
      setCollectionInfo({
        totalSupply: 10000,
        minted: Math.floor(Math.random() * 1000),
        price: 0.5
      })
    } catch (err) {
      console.error('Failed to fetch collection stats:', err)
    }
  }

  const handleMint = async () => {
    if (!connected) {
      setError('Please connect your wallet first')
      return
    }

    setMinting(true)
    setError('')

    try {
      const result = await mintNFT(
        connection,
        publicKey,
        candyMachineAddress,
        collectionAddress
      )

      setMintedNFT(result)
      setCollectionInfo(prev => ({
        ...prev,
        minted: prev.minted + 1
      }))
    } catch (err) {
      console.error('Minting error:', err)
      setError(err.message || 'Failed to mint NFT. Please try again.')
    } finally {
      setMinting(false)
    }
  }

  const progress = (collectionInfo.minted / collectionInfo.totalSupply) * 100

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <div className="flex justify-center">
        <WalletMultiButton className="!bg-amber-600 hover:!bg-amber-700" />
      </div>

      {/* Collection Stats */}
      <Card className="bg-slate-900/50 border-amber-900/30">
        <CardHeader>
          <CardTitle className="text-amber-100">Leonardo da Vinci Collection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-amber-100/70 mb-2">
              <span>Minted</span>
              <span>{collectionInfo.minted} / {collectionInfo.totalSupply}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center py-3 border-t border-amber-900/30">
            <span className="text-amber-100/80">Mint Price</span>
            <span className="text-2xl font-bold text-amber-400">
              {collectionInfo.price} SOL
            </span>
          </div>

          {/* Royalty Info */}
          <div className="text-sm text-amber-100/60">
            <p>✓ 15% royalties on secondary sales</p>
            <p>✓ G Lounge membership included</p>
            <p>✓ Voting rights in Codex Collective</p>
          </div>

          {/* Mint Button */}
          {connected ? (
            <Button 
              onClick={handleMint}
              disabled={minting || collectionInfo.minted >= collectionInfo.totalSupply}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 h-12 text-lg"
            >
              {minting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Minting...
                </>
              ) : collectionInfo.minted >= collectionInfo.totalSupply ? (
                'SOLD OUT'
              ) : (
                'Mint NFT'
              )}
            </Button>
          ) : (
            <div className="text-center p-4 bg-amber-900/20 rounded-lg">
              <WalletIcon className="w-8 h-8 mx-auto mb-2 text-amber-400" />
              <p className="text-amber-100/80">Connect your wallet to mint</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Message */}
      {mintedNFT && (
        <Card className="bg-emerald-900/20 border-emerald-500/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-emerald-500" />
              <h3 className="text-2xl font-bold text-emerald-100">NFT Minted Successfully!</h3>
              <p className="text-emerald-100/80">Congratulations! Your Leonardo da Vinci NFT has been minted.</p>
              
              {mintedNFT.image && (
                <img 
                  src={mintedNFT.image} 
                  alt="Minted NFT" 
                  className="w-64 h-64 mx-auto rounded-lg object-cover"
                />
              )}
              
              <div className="space-y-2">
                <p className="text-emerald-100 font-semibold">{mintedNFT.name}</p>
                <a 
                  href={`https://explorer.solana.com/address/${mintedNFT.mint}?cluster=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline text-sm"
                >
                  View on Solana Explorer →
                </a>
              </div>

              <Button
                onClick={() => setMintedNFT(null)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Mint Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
