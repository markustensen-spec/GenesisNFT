'use client'

import React, { useState } from 'react'

export default function GenerateNFTsPage() {
  const [generating, setGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState([])
  const [currentImage, setCurrentImage] = useState(null)
  const [error, setError] = useState(null)

  const generateSingleImage = async () => {
    setGenerating(true)
    setError(null)
    
    try {
      const res = await fetch('/api/generate-nft-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      const data = await res.json()
      
      if (data.success) {
        setCurrentImage(data)
        setGeneratedImages(prev => [data, ...prev].slice(0, 10))
      } else {
        setError(data.error || 'Generation failed')
      }
    } catch (err) {
      setError(err.message)
    }
    
    setGenerating(false)
  }

  const downloadImage = (imageUrl, subject) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `leonardo-${subject.replace(/\s+/g, '-')}.jpg`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-slate-800 border border-amber-600/30 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">🎨 AI NFT Image Generator</h1>
          <p className="text-amber-100/70">Generate unlimited Leonardo da Vinci style anatomical sketches for your collection</p>
        </div>

        {/* Generator Controls */}
        <div className="bg-slate-800 border border-emerald-600/30 rounded-xl p-6">
          <button
            onClick={generateSingleImage}
            disabled={generating}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-6 px-8 rounded-xl text-lg disabled:opacity-50 transition-all shadow-lg"
          >
            {generating ? '🎨 Generating... (takes 10-20 seconds)' : '✨ Generate New NFT Image'}
          </button>
          
          <p className="text-amber-100/60 text-sm text-center mt-4">
            Each generation uses AI to create unique Leonardo da Vinci style anatomical sketches
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
            <p className="text-red-400 font-semibold">❌ Error: {error}</p>
          </div>
        )}

        {/* Current Image Display */}
        {currentImage && (
          <div className="bg-slate-800 border border-amber-600/30 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amber-400">Latest Generation:</h2>
              <button
                onClick={() => downloadImage(currentImage.imageUrl, currentImage.subject)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                💾 Download
              </button>
            </div>
            
            <div className="relative rounded-lg overflow-hidden bg-slate-900 border-2 border-amber-600/20">
              <img 
                src={currentImage.imageUrl} 
                alt={currentImage.subject}
                className="w-full h-auto"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  currentImage.type === 'anatomy' 
                    ? 'bg-red-900/30 text-red-400 border border-red-600/30' 
                    : 'bg-blue-900/30 text-blue-400 border border-blue-600/30'
                }`}>
                  {currentImage.type === 'anatomy' ? '🫀 Anatomy' : '⚙️ Invention'}
                </span>
                <p className="text-amber-400 font-semibold italic">"{currentImage.italian}"</p>
              </div>
              <p className="text-amber-100 font-semibold">Subject: {currentImage.subject}</p>
              <p className="text-amber-100/60 text-sm">Features: Italian annotations, mirror writing, Renaissance style</p>
            </div>
          </div>
        )}

        {/* Gallery */}
        {generatedImages.length > 0 && (
          <div className="bg-slate-800 border border-purple-600/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">📚 Recent Generations ({generatedImages.length})</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {generatedImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={img.imageUrl} 
                    alt={img.subject}
                    className="w-full h-auto rounded-lg border-2 border-slate-700 hover:border-amber-600 transition-all cursor-pointer"
                    onClick={() => setCurrentImage(img)}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadImage(img.imageUrl, img.subject)
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      💾
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-3">📋 How to Use:</h3>
          <ul className="space-y-2 text-blue-100/70 text-sm">
            <li>1. Click "Generate New NFT Image" to create a unique Leonardo da Vinci style sketch</li>
            <li>2. AI generates anatomical studies (arms, legs, spine, heart, etc.)</li>
            <li>3. Each image is unique with Renaissance-style sepia tones on aged parchment</li>
            <li>4. Download images you like for your NFT collection</li>
            <li>5. Generate as many as you need - completely free!</li>
          </ul>
          
          <div className="mt-4 p-4 bg-amber-900/20 rounded-lg">
            <p className="text-amber-400 font-semibold mb-2">💡 Pro Tip:</p>
            <p className="text-amber-100/70 text-sm">
              Generate 20-50 unique images to expand your NFT collection variety. Each generation takes about 10-20 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
