'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Crown, TrendingUp, Wallet, Sparkles, Lock, Zap, Trophy, Users, Gem, ChevronRight, Menu, X } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null)
  const [cryptoPrices, setCryptoPrices] = useState([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mintStatus, setMintStatus] = useState('')

  useEffect(() => {
    if (activeTab === 'investments') {
      fetchCryptoPrices()
    }
  }, [activeTab])

  const fetchCryptoPrices = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/prices')
      const data = await response.json()
      if (data.success) {
        setCryptoPrices(data.data)
      }
    } catch (error) {
      console.error('Error fetching prices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMint = async () => {
    if (!connected) {
      setMintStatus('Please connect your wallet first')
      return
    }
    setMintStatus('Minting... (Testnet)')
    try {
      const response = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: walletAddress })
      })
      const data = await response.json()
      if (data.success) {
        setMintStatus(`Success! Mock Mint ID: ${data.mintId}`)
      } else {
        setMintStatus('Mint failed: ' + data.error)
      }
    } catch (error) {
      setMintStatus('Error: ' + error.message)
    }
  }

  const handleWhitelistSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, walletAddress: walletAddress })
      })
      alert('Successfully joined the whitelist!')
      setEmail('')
    } catch (error) {
      alert('Error joining whitelist')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-amber-900/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-amber-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                GenesisHQ
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => setActiveTab('home')} className="text-amber-100 hover:text-amber-400">
                Home
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('investments')} className="text-amber-100 hover:text-amber-400">
                Investments
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('nft')} className="text-amber-100 hover:text-amber-400">
                Leonardo NFT
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('lounge')} className="text-amber-100 hover:text-amber-400 flex items-center">
                <Crown className="w-4 h-4 mr-1" />
                G Lounge
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('game')} className="text-amber-100 hover:text-amber-400">
                Game
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <WalletMultiButton className="!bg-gradient-to-r !from-amber-600 !to-amber-700 hover:!from-amber-500 hover:!to-amber-600" />
              <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2 pb-4">
              <Button variant="ghost" onClick={() => { setActiveTab('home'); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                Home
              </Button>
              <Button variant="ghost" onClick={() => { setActiveTab('investments'); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                Investments
              </Button>
              <Button variant="ghost" onClick={() => { setActiveTab('nft'); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                Leonardo NFT
              </Button>
              <Button variant="ghost" onClick={() => { setActiveTab('lounge'); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                G Lounge
              </Button>
              <Button variant="ghost" onClick={() => { setActiveTab('game'); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                Game
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        {activeTab === 'home' && (
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <Badge className="mb-4 bg-amber-600/20 text-amber-400 border-amber-600/30 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                Where Renaissance Meets Revolution
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                Welcome to GenesisHQ
              </h1>
              <p className="text-xl md:text-2xl text-amber-100/80 max-w-3xl mx-auto mb-8">
                An exclusive platform combining Leonardo da Vinci's timeless genius with cutting-edge blockchain innovation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => setActiveTab('lounge')} className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-8">
                  <Crown className="w-5 h-5 mr-2" />
                  Enter G Lounge
                </Button>
                <Button size="lg" variant="outline" onClick={() => setActiveTab('nft')} className="border-amber-600 text-amber-400 hover:bg-amber-600/10">
                  View Leonardo Collection
                </Button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="bg-slate-900/50 border-amber-900/30 backdrop-blur-sm hover:border-amber-600/50 transition-all cursor-pointer" onClick={() => setActiveTab('lounge')}>
                <CardHeader>
                  <Crown className="w-12 h-12 text-amber-500 mb-4" />
                  <CardTitle className="text-amber-100">G Lounge</CardTitle>
                  <CardDescription className="text-amber-100/60">
                    The ultimate exclusive members club
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-amber-100/70">
                  <p>Access premium trading tools, exclusive content, and the Codex Collective. Join the elite.</p>
                  <div className="mt-4 flex items-center text-amber-500">
                    <span className="text-sm">$55/month membership</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-amber-900/30 backdrop-blur-sm hover:border-amber-600/50 transition-all cursor-pointer" onClick={() => setActiveTab('nft')}>
                <CardHeader>
                  <Gem className="w-12 h-12 text-amber-500 mb-4" />
                  <CardTitle className="text-amber-100">Leonardo da Vinci NFT</CardTitle>
                  <CardDescription className="text-amber-100/60">
                    10 originals + 9,989 generative pieces
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-amber-100/70">
                  <p>Own a piece of history reimagined. Renaissance engineering meets blockchain technology.</p>
                  <div className="mt-4 flex items-center text-amber-500">
                    <span className="text-sm">Minting on Solana</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-amber-900/30 backdrop-blur-sm hover:border-amber-600/50 transition-all cursor-pointer" onClick={() => setActiveTab('investments')}>
                <CardHeader>
                  <TrendingUp className="w-12 h-12 text-amber-500 mb-4" />
                  <CardTitle className="text-amber-100">Live Investments</CardTitle>
                  <CardDescription className="text-amber-100/60">
                    Crypto & stocks with real-time data
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-amber-100/70">
                  <p>Track and allocate your $CAX tokens across diverse investment opportunities with live market data.</p>
                </CardContent>
              </Card>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-slate-900/30 rounded-lg border border-amber-900/20">
                <div className="text-3xl font-bold text-amber-400 mb-2">10,000</div>
                <div className="text-amber-100/60">NFT Collection</div>
              </div>
              <div className="text-center p-6 bg-slate-900/30 rounded-lg border border-amber-900/20">
                <div className="text-3xl font-bold text-amber-400 mb-2">$CAX</div>
                <div className="text-amber-100/60">Caviar Token</div>
              </div>
              <div className="text-center p-6 bg-slate-900/30 rounded-lg border border-amber-900/20">
                <div className="text-3xl font-bold text-amber-400 mb-2">Elite</div>
                <div className="text-amber-100/60">G Lounge Access</div>
              </div>
              <div className="text-center p-6 bg-slate-900/30 rounded-lg border border-amber-900/20">
                <div className="text-3xl font-bold text-amber-400 mb-2">Play</div>
                <div className="text-amber-100/60">Genesis Caviar Game</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-amber-100 mb-8">Live Investments</h2>
              
              <Tabs defaultValue="crypto" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-900/50">
                  <TabsTrigger value="crypto" className="data-[state=active]:bg-amber-600">Cryptocurrency</TabsTrigger>
                  <TabsTrigger value="stocks" className="data-[state=active]:bg-amber-600">Stocks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="crypto" className="mt-6">
                  {loading ? (
                    <div className="text-center py-12 text-amber-100">Loading market data...</div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cryptoPrices.map((crypto) => (
                        <Card key={crypto.id} className="bg-slate-900/50 border-amber-900/30 hover:border-amber-600/50 transition-all">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-amber-100 text-lg">{crypto.name}</CardTitle>
                              <Badge variant="outline" className="border-amber-600/30 text-amber-400">
                                {crypto.symbol.toUpperCase()}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-amber-400 mb-2">
                              ${crypto.current_price?.toLocaleString()}
                            </div>
                            <div className={`text-sm ${crypto.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {crypto.price_change_24h >= 0 ? '↑' : '↓'} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                            </div>
                            <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700" size="sm">
                              Allocate $CAX
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="stocks" className="mt-6">
                  <Card className="bg-slate-900/50 border-amber-900/30">
                    <CardContent className="py-12 text-center">
                      <TrendingUp className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                      <p className="text-amber-100/60">Stock market integration coming soon</p>
                      <p className="text-sm text-amber-100/40 mt-2">Connect with IEX Cloud for live stock data</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {activeTab === 'nft' && (
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-amber-600/20 text-amber-400 border-amber-600/30 px-4 py-2">
                  <Gem className="w-4 h-4 mr-2 inline" />
                  Exclusive Collection
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">
                  Leonardo da Vinci NFT Collection
                </h2>
                <p className="text-xl text-amber-100/70 max-w-2xl mx-auto">
                  10 original masterpieces + 9,989 generative variations. Renaissance engineering meets blockchain innovation.
                </p>
              </div>

              {/* Featured NFT */}
              <Card className="bg-slate-900/50 border-amber-900/30 mb-8 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-96 md:h-auto">
                      <img 
                        src={process.env.NEXT_PUBLIC_NFT_IMAGE_URL || '/api/placeholder/600/600'} 
                        alt="Leonardo da Vinci NFT" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-amber-100 mb-4">Genesis #0001</h3>
                      <p className="text-amber-100/70 mb-6">
                        The first of 10 original Leonardo da Vinci inspired mechanical masterpieces. Each NFT combines Renaissance genius with modern holographic technology, creating a bridge between history and the future.
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-amber-100/60">Collection Size</span>
                          <span className="text-amber-100 font-semibold">10,000 NFTs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-100/60">Original Pieces</span>
                          <span className="text-amber-100 font-semibold">10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-100/60">Generative</span>
                          <span className="text-amber-100 font-semibold">9,989</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-100/60">Network</span>
                          <span className="text-amber-100 font-semibold">Solana Devnet</span>
                        </div>
                      </div>

                      <Button 
                        onClick={handleMint} 
                        disabled={!connected}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 mb-3"
                        size="lg"
                      >
                        {connected ? 'Mint NFT (Testnet)' : 'Connect Wallet to Mint'}
                      </Button>
                      
                      {mintStatus && (
                        <p className="text-sm text-amber-400 text-center">{mintStatus}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tokenomics */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-slate-900/50 border-amber-900/30">
                  <CardHeader>
                    <CardTitle className="text-amber-100">$CAX Token</CardTitle>
                    <CardDescription className="text-amber-100/60">Caviar Token Economy</CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2">
                      <li>• Total Supply: 1,000,000,000 $CAX</li>
                      <li>• Utility: Staking, gaming, governance</li>
                      <li>• NFT holders receive bonus allocation</li>
                      <li>• G Lounge members get premium rates</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-amber-900/30">
                  <CardHeader>
                    <CardTitle className="text-amber-100">Join Whitelist</CardTitle>
                    <CardDescription className="text-amber-100/60">Get early access to minting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleWhitelistSubmit} className="space-y-3">
                      <Input 
                        type="email" 
                        placeholder="your@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-800 border-amber-900/30 text-amber-100"
                        required
                      />
                      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                        Join Whitelist
                      </Button>
                      {connected && (
                        <p className="text-xs text-amber-100/60 text-center">
                          Wallet: {publicKey?.toString().slice(0, 8)}...
                        </p>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lounge' && (
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Hero */}
              <div className="text-center mb-16 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-amber-900/20 blur-3xl"></div>
                <div className="relative">
                  <Crown className="w-20 h-20 text-amber-500 mx-auto mb-6" />
                  <h2 className="text-5xl md:text-6xl font-bold text-amber-100 mb-6">
                    Welcome to G Lounge
                  </h2>
                  <p className="text-xl md:text-2xl text-amber-100/80 max-w-3xl mx-auto mb-8">
                    The ultimate exclusive members club where elite traders, collectors, and visionaries converge
                  </p>
                  <Badge className="bg-amber-600 text-white px-6 py-3 text-lg">
                    $55/month Premium Membership
                  </Badge>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <Lock className="w-10 h-10 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Exclusive Content</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2">
                      <li>• Premium market analysis and insights</li>
                      <li>• Early access to new NFT drops</li>
                      <li>• Private webinars with industry experts</li>
                      <li>• Exclusive Leonardo collection previews</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <Zap className="w-10 h-10 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">MAX Trading Bot</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2">
                      <li>• AI-powered trading strategies</li>
                      <li>• Real-time market signals</li>
                      <li>• Automated portfolio optimization</li>
                      <li>• Risk management tools</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <Users className="w-10 h-10 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Codex Collective</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2">
                      <li>• Private community of elite members</li>
                      <li>• Direct networking opportunities</li>
                      <li>• Collaborative investment pools</li>
                      <li>• Member-only events and meetups</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <Trophy className="w-10 h-10 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Premium Perks</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2">
                      <li>• Priority customer support</li>
                      <li>• Enhanced staking rewards (2x)</li>
                      <li>• Reduced trading fees</li>
                      <li>• Exclusive airdrops and bonuses</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <Card className="bg-gradient-to-r from-amber-600/20 to-amber-900/20 border-amber-600/50">
                <CardContent className="py-12 text-center">
                  <h3 className="text-3xl font-bold text-amber-100 mb-4">Ready to Join the Elite?</h3>
                  <p className="text-amber-100/70 mb-6 max-w-2xl mx-auto">
                    G Lounge membership unlocks the full potential of GenesisHQ. Experience premium features, exclusive access, and join a community of visionaries.
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 px-8"
                    disabled
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Join G Lounge - Coming Soon
                  </Button>
                  <p className="text-sm text-amber-100/50 mt-4">Stripe integration in progress</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'game' && (
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-amber-100 mb-6">Genesis Caviar Game</h2>
              <p className="text-xl text-amber-100/70 mb-8">
                Agar.io-style multiplayer game with $CAX wagering (Coming Soon)
              </p>
              
              <Card className="bg-slate-900/50 border-amber-900/30">
                <CardContent className="py-16">
                  <Trophy className="w-24 h-24 text-amber-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-amber-100 mb-4">Game Features</h3>
                  <div className="text-left max-w-md mx-auto space-y-3 text-amber-100/70">
                    <p>• Real-time multiplayer gameplay</p>
                    <p>• Wager $CAX tokens to compete</p>
                    <p>• Eat caviar to grow and dominate</p>
                    <p>• Global leaderboards</p>
                    <p>• Winner takes the pot</p>
                  </div>
                  <Button className="mt-8 bg-amber-600 hover:bg-amber-700" size="lg" disabled>
                    Play Game - Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-amber-900/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold text-amber-100">GenesisHQ</span>
          </div>
          <p className="text-amber-100/60 mb-4">Where Renaissance Meets Revolution</p>
          <p className="text-sm text-amber-100/40">© 2025 GenesisHQ. All rights reserved.</p>
          <div className="mt-4 text-xs text-amber-100/30">
            <p>⚠️ Testnet Environment - Not for Production Use</p>
            <p>Smart contracts require audit before mainnet deployment</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network), [network])
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <GenesisHQContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
