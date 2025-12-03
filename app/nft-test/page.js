'use client'

import React, { useState, useEffect } from 'react'

export default function NFTTestPage() {
  const [stats, setStats] = useState(null)
  const [testNFT, setTestNFT] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch('/api/nft/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Stats error:', error)
    }
  }

  const testRandomNFT = async () => {
    setLoading(true)
    try {
      // Generate random NFT number
      const randomNum = Math.floor(Math.random() * 10000) + 1
      const res = await fetch(`/api/nft/metadata/${randomNum}`)
      const data = await res.json()
      setTestNFT({ ...data, number: randomNum })
    } catch (error) {
      console.error('NFT test error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-slate-800 border border-amber-600/30 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">🎨 NFT Test Page</h1>
          <p className="text-amber-100/70">Test your Leonardo da Vinci NFT collection</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="bg-slate-800 border border-emerald-600/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-emerald-400 mb-4">📊 Collection Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-amber-100/60 text-sm">Total Supply</p>
                <p className="text-2xl font-bold text-amber-100">{stats.stats?.totalSupply || 10000}</p>
              </div>
              <div>
                <p className="text-amber-100/60 text-sm">Remaining</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.stats?.remaining || 10000}</p>
              </div>
              <div>
                <p className="text-amber-100/60 text-sm">Mint Price</p>
                <p className="text-2xl font-bold text-amber-400">${stats.stats?.mintPriceUSD || 0.01}</p>
              </div>
              <div>
                <p className="text-amber-100/60 text-sm">Network</p>
                <p className="text-2xl font-bold text-blue-400">{stats.stats?.network || 'devnet'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Test Button */}
        <button
          onClick={testRandomNFT}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-6 px-8 rounded-xl text-lg disabled:opacity-50 transition-all shadow-lg"
        >
          {loading ? '🎲 Rolling...' : '🎲 Test Random NFT Mint'}
        </button>

        {/* NFT Result */}
        {testNFT && (
          <div className="bg-slate-800 border border-amber-600/30 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-amber-400">You Got:</h2>
              <span className="text-sm text-amber-100/60">NFT #{testNFT.number}</span>
            </div>

            {/* NFT Image */}
            <div className="relative rounded-lg overflow-hidden bg-slate-900 border-2 border-amber-600/20">
              <img 
                src={testNFT.image} 
                alt={testNFT.name}
                className="w-full h-auto"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2VyaWYiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ORlQgSW1hZ2U8L3RleHQ+PC9zdmc+'
                }}
              />
            </div>

            {/* NFT Details */}
            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-bold text-amber-100 mb-1">{testNFT.name}</h3>
                <p className="text-amber-100/70 text-sm">{testNFT.description}</p>
              </div>

              {/* Attributes */}
              <div>
                <p className="text-amber-400 font-semibold mb-2">Attributes:</p>
                <div className="grid grid-cols-2 gap-2">
                  {testNFT.attributes?.map((attr, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-amber-900/20">
                      <p className="text-amber-100/60 text-xs">{attr.trait_type}</p>
                      <p className="text-amber-100 font-semibold text-sm">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Messages */}
              {testNFT.name.includes('Pagina Vuota') && (
                <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                  <p className="text-purple-400 font-bold text-center">🎉 ULTRA RARE MYSTERY BLANK PAGE! 🎉</p>
                  <p className="text-purple-300 text-sm text-center mt-1">Only ~1% chance!</p>
                </div>
              )}

              {testNFT.name.includes('Selfie') && (
                <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-lg p-4">
                  <p className="text-emerald-400 font-bold text-center">💰 EPIC SELFIE - $5,000 PRIZE! 💰</p>
                  <p className="text-emerald-300 text-sm text-center mt-1">1 of 1 - Ultimate Winner!</p>
                </div>
              )}

              {testNFT.name.includes('Exclusive') && (
                <div className="bg-amber-900/20 border border-amber-500/50 rounded-lg p-4">
                  <p className="text-amber-400 font-bold text-center">👑 LEGENDARY EXCLUSIVE! 👑</p>
                  <p className="text-amber-300 text-sm text-center mt-1">Only 10 in existence</p>
                </div>
              )}
            </div>

            {/* Test Again Button */}
            <button
              onClick={testRandomNFT}
              className="w-full bg-slate-700 hover:bg-slate-600 text-amber-400 font-semibold py-3 px-4 rounded-lg transition-all"
            >
              🎲 Test Another Random NFT
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-3">📋 How This Works:</h3>
          <ul className="space-y-2 text-blue-100/70 text-sm">
            <li>• Click "Test Random NFT Mint" to simulate minting</li>
            <li>• You'll get a random NFT from the 10,000 collection</li>
            <li>• ~1% chance to get a mystery blank page</li>
            <li>• Watch for the Epic Selfie ($5K prize) or Legendary Exclusives</li>
            <li>• This tests your metadata API and randomization</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
