'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, ExternalLink, Wallet, ArrowLeft, RefreshCw } from 'lucide-react'

export default function MyNFTsPage() {
  const [loading, setLoading] = useState(true)
  const [nfts, setNfts] = useState([])
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    checkWalletAndFetchNFTs()
  }, [])

  const getProvider = () => {
    if (typeof window === 'undefined') return null
    return window.solana || window.phantom?.solana || window.solflare
  }

  const checkWalletAndFetchNFTs = async () => {
    const provider = getProvider()
    if (provider) {
      try {
        const response = await provider.connect({ onlyIfTrusted: true })
        if (response.publicKey) {
          setWalletConnected(true)
          setWalletAddress(response.publicKey.toString())
          await fetchUserNFTs(response.publicKey.toString())
        }
      } catch (err) {
        setWalletConnected(false)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  const connectWallet = async () => {
    const provider = getProvider()
    if (!provider) {
      setError('Ingen Solana wallet funnet. Installer Phantom eller Solflare.')
      return
    }

    try {
      const response = await provider.connect()
      if (response.publicKey) {
        setWalletConnected(true)
        setWalletAddress(response.publicKey.toString())
        await fetchUserNFTs(response.publicKey.toString())
      }
    } catch (err) {
      setError('Tilkobling avvist')
    }
  }

  const fetchUserNFTs = async (wallet) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/nft/user-nfts?wallet=${wallet}`)
      const data = await response.json()
      
      if (data.success) {
        setNfts(data.nfts || [])
      } else {
        setError(data.error || 'Kunne ikke hente NFTs')
      }
    } catch (err) {
      setError('Feil ved henting av NFTs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-amber-900/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/'}
              className="text-amber-100 hover:text-amber-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tilbake
            </Button>
            <h1 className="text-2xl font-bold text-amber-100">Mine NFTs</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Wallet Status */}
        {walletConnected && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-emerald-900/30 border border-emerald-500/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              <span className="text-emerald-400 text-sm">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 mx-auto text-amber-500 animate-spin mb-4" />
            <p className="text-amber-100/70">Henter dine NFTs...</p>
          </div>
        )}

        {/* Not Connected */}
        {!loading && !walletConnected && (
          <div className="text-center py-20">
            <Wallet className="w-16 h-16 mx-auto text-amber-500 mb-6" />
            <h2 className="text-2xl font-bold text-amber-100 mb-4">Koble til Wallet</h2>
            <p className="text-amber-100/70 mb-6">Koble til din Solana wallet for å se dine NFTs</p>
            <Button 
              onClick={connectWallet}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Koble til Wallet
            </Button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        )}

        {/* No NFTs */}
        {!loading && walletConnected && nfts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🖼️</div>
            <h2 className="text-2xl font-bold text-amber-100 mb-4">Ingen NFTs ennå</h2>
            <p className="text-amber-100/70 mb-6">Du har ikke mintet noen NFTs ennå</p>
            <Button 
              onClick={() => window.location.href = '/?tab=crypto'}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
            >
              Mint din første NFT
            </Button>
          </div>
        )}

        {/* NFT Grid */}
        {!loading && nfts.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-amber-100">
                {nfts.length} NFT{nfts.length > 1 ? 's' : ''} i din samling
              </h2>
              <Button 
                variant="outline" 
                onClick={() => fetchUserNFTs(walletAddress)}
                className="border-amber-500/50 text-amber-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Oppdater
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {nfts.map((nft, idx) => (
                <Card 
                  key={idx} 
                  className={`overflow-hidden bg-slate-900/50 hover:bg-slate-900/70 transition-all ${
                    nft.type === 'ILLUMINATI' ? 'border-2 border-amber-500 shadow-amber-500/20 shadow-lg' : 'border border-slate-700'
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={nft.image} 
                      alt={nft.name}
                      className="w-full h-56 object-cover"
                    />
                    {nft.type === 'ILLUMINATI' && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                        🌟 ATLANTICUS
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-amber-100 mb-1">{nft.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">#{nft.nftNumber}</p>
                    
                    {nft.type === 'ILLUMINATI' && (
                      <div className="bg-amber-900/30 rounded-lg p-2 mb-3">
                        <p className="text-amber-300 text-xs">
                          ✨ Lifetime Access • 8% APY • Exclusive Airdrops
                        </p>
                      </div>
                    )}
                    
                    <a 
                      href={nft.explorerUrl || `https://solscan.io/token/${nft.mintAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Se på Solscan <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mint More */}
            <div className="text-center mt-12">
              <Button 
                onClick={() => window.location.href = '/?tab=crypto'}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
              >
                Mint Flere NFTs
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
