'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Crown, TrendingUp, Wallet, Sparkles, Lock, Zap, Trophy, Users, Gem, ChevronRight, Menu, X, Play, LogIn, UserPlus, LogOut, BookOpen, MessageSquare, Lightbulb } from 'lucide-react'
import WhitepaperSection from './whitepaper-section'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [user, setUser] = useState(null)
  const [cryptoPrices, setCryptoPrices] = useState([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mintStatus, setMintStatus] = useState('')
  
  // Auth states
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'
  const [authForm, setAuthForm] = useState({ email: '', password: '', username: '' })

  useEffect(() => {
    if (activeTab === 'investments') {
      fetchCryptoPrices()
    }
  }, [activeTab])

  // Check if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('genesishq_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

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

  const handleAuth = async (e) => {
    e.preventDefault()
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      })
      const data = await response.json()
      
      if (data.success) {
        const userData = { ...data.user, walletAddress: 'GeN' + Math.random().toString(36).substring(2, 15) }
        setUser(userData)
        localStorage.setItem('genesishq_user', JSON.stringify(userData))
        setShowAuthModal(false)
        setAuthForm({ email: '', password: '', username: '' })
        alert(authMode === 'login' ? 'Welcome back!' : 'Account created successfully!')
      } else {
        alert(data.error || 'Authentication failed')
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('genesishq_user')
    setActiveTab('home')
  }

  const handleMint = async () => {
    if (!user) {
      alert('Please login to mint NFTs')
      setShowAuthModal(true)
      return
    }
    setMintStatus('Minting... (Testnet)')
    try {
      const response = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: user.walletAddress, userId: user.id })
      })
      const data = await response.json()
      if (data.success) {
        setMintStatus(`Success! Mint ID: ${data.mintId}`)
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
        body: JSON.stringify({ email, walletAddress: user?.walletAddress })
      })
      alert('Successfully joined the whitelist!')
      setEmail('')
    } catch (error) {
      alert('Error joining whitelist')
    }
  }

  const playGame = () => {
    if (!user) {
      alert('Please login to play the game')
      setShowAuthModal(true)
      return
    }
    setActiveTab('game')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950">
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900 border-amber-900/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-amber-100">
                  {authMode === 'login' ? 'Login to GenesisHQ' : 'Create Account'}
                </CardTitle>
                <button onClick={() => setShowAuthModal(false)}>
                  <X className="w-6 h-6 text-amber-400" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <Label className="text-amber-100">Username</Label>
                    <Input
                      value={authForm.username}
                      onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                      className="bg-slate-800 border-amber-900/30 text-amber-100"
                      required={authMode === 'register'}
                    />
                  </div>
                )}
                <div>
                  <Label className="text-amber-100">Email</Label>
                  <Input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                    className="bg-slate-800 border-amber-900/30 text-amber-100"
                    required
                  />
                </div>
                <div>
                  <Label className="text-amber-100">Password</Label>
                  <Input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    className="bg-slate-800 border-amber-900/30 text-amber-100"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                  {authMode === 'login' ? 'Login' : 'Create Account'}
                </Button>
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="w-full text-sm text-amber-400 hover:text-amber-300"
                >
                  {authMode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-xl border-b border-amber-900/20">
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
                HUB
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('caviar')} className="text-amber-100 hover:text-amber-400">
                Caviar ($CAX)
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('lounge')} className="text-amber-100 hover:text-amber-400 flex items-center">
                <Crown className="w-4 h-4 mr-1" />
                G Lounge
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('nft')} className="text-amber-100 hover:text-amber-400">
                Leonardo NFT
              </Button>
              <Button variant="ghost" onClick={playGame} className="text-amber-100 hover:text-amber-400">
                Play Arena
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('whitepaper')} className="text-amber-100 hover:text-amber-400">
                Whitepaper
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <div className="text-sm text-amber-100">{user.username}</div>
                    <div className="text-xs text-amber-400">{user.walletAddress?.slice(0, 8)}...</div>
                  </div>
                  <Button onClick={handleLogout} variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-600/10">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={() => { setAuthMode('login'); setShowAuthModal(true) }} className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
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
                HUB
              </Button>
              <Button variant="ghost" onClick={() => { setActiveTab('caviar'); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                Caviar ($CAX)
              </Button>
              <Button variant="ghost" onClick={() => { setActiveTab('lounge'); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                G Lounge
              </Button>
              <Button variant="ghost" onClick={() => { setActiveTab('nft'); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                Leonardo NFT
              </Button>
              <Button variant="ghost" onClick={() => { playGame(); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                Play Arena
              </Button>
              <Button variant="ghost" onClick={() => { setActiveTab('whitepaper'); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                Whitepaper
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
                A revolutionary platform uniting Leonardo da Vinci's genius with blockchain technology, exclusive community access, and competitive gaming
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!user && (
                  <Button size="lg" onClick={() => { setAuthMode('register'); setShowAuthModal(true) }} className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-8">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Join GenesisHQ
                  </Button>
                )}
                <Button size="lg" onClick={playGame} className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-8">
                  <Play className="w-5 h-5 mr-2" />
                  Play Arena
                </Button>
              </div>
            </div>

            {/* Leonardo NFT Teaser */}
            <div className="mb-16">
              <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/40 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <img 
                      src={process.env.NEXT_PUBLIC_NFT_IMAGE_URL || '/api/placeholder/600/400'} 
                      alt="Leonardo da Vinci NFT" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <Gem className="w-12 h-12 text-amber-500 mb-4" />
                    <h3 className="text-3xl font-bold text-amber-100 mb-3">Leonardo da Vinci NFT Collection</h3>
                    <p className="text-amber-100/80 mb-4">
                      10 original masterpieces + 9,990 generative pieces. Own a piece of Renaissance genius on the blockchain with lifetime benefits and Codex Collective voting rights.
                    </p>
                    <Button onClick={() => setActiveTab('nft')} size="lg" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 w-fit">
                      <Gem className="w-5 h-5 mr-2" />
                      Explore Collection
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Features Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-amber-100 text-center mb-8">Platform Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-amber-900/30 backdrop-blur-sm hover:border-amber-600/50 transition-all cursor-pointer" onClick={() => setActiveTab('investments')}>
                  <CardHeader>
                    <Wallet className="w-16 h-16 text-amber-500 mb-4" />
                    <CardTitle className="text-amber-100 text-2xl">HUB - Banking Ecosystem</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">
                      Complete neo-banking solution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-4 text-base">A fully licensed banking platform combining traditional finance with Web3. Multi-currency wallet, debit cards, and investment tools.</p>
                    <ul className="space-y-2">
                      <li>✓ Multi-currency wallet (AED, USD, EUR, NOK)</li>
                      <li>✓ Licensed banking operations (VARA, UAE)</li>
                      <li>✓ Debit cards with cashback rewards</li>
                      <li>✓ Fiat on/off-ramps & IBANs</li>
                      <li>✓ Live crypto & stock tracking</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-amber-900/30 backdrop-blur-sm hover:border-amber-600/50 transition-all cursor-pointer" onClick={() => setActiveTab('lounge')}>
                  <CardHeader>
                    <Crown className="w-16 h-16 text-amber-500 mb-4" />
                    <CardTitle className="text-amber-100 text-2xl">G Lounge</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">
                      Home of the Codex Collective
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-4 text-base">The exclusive members club housing the Codex Collective - a Renaissance-inspired community of elite visionaries and innovators.</p>
                    <ul className="space-y-2">
                      <li>✓ Codex Collective private community</li>
                      <li>✓ Expert webinars & masterclasses</li>
                      <li>✓ MAX Trading Bot premium access</li>
                      <li>✓ 2x staking rewards & reduced fees</li>
                      <li>✓ Early access to features & NFT drops</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-amber-900/30 backdrop-blur-sm hover:border-amber-600/50 transition-all cursor-pointer" onClick={() => setActiveTab('caviar')}>
                  <CardHeader>
                    <Zap className="w-16 h-16 text-amber-500 mb-4" />
                    <CardTitle className="text-amber-100 text-2xl">Caviar Token ($CAX)</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">
                      Governance & utility token
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-4 text-base">The $CAX token powers the entire ecosystem with governance rights, staking rewards, and platform access for all GenesisHQ features.</p>
                    <ul className="space-y-2">
                      <li>✓ 1 Billion total supply</li>
                      <li>✓ Governance voting rights</li>
                      <li>✓ 20% base APY staking rewards</li>
                      <li>✓ Required for P2E game entry</li>
                      <li>✓ Deflationary (1% burn per transaction)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-emerald-900/30 backdrop-blur-sm hover:border-emerald-600/50 transition-all cursor-pointer" onClick={playGame}>
                  <CardHeader>
                    <Trophy className="w-16 h-16 text-emerald-500 mb-4" />
                    <CardTitle className="text-amber-100 text-2xl">Play-to-Earn Arena</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">
                      Genesis Caviar game
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-4 text-base">Compete in real-time multiplayer action. Grow your caviar, defeat opponents, and earn $CAX tokens based on your performance and ranking.</p>
                    <ul className="space-y-2">
                      <li>✓ Real-time multiplayer gameplay</li>
                      <li>✓ Earn $CAX tokens by playing</li>
                      <li>✓ Global leaderboard rankings</li>
                      <li>✓ Skill-based competitive matches</li>
                      <li>✓ Daily and weekly tournaments</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              <div className="text-center p-6 bg-slate-900/30 rounded-lg border border-amber-900/20">
                <div className="text-3xl font-bold text-amber-400 mb-2">10,000</div>
                <div className="text-amber-100/60">NFT Collection</div>
              </div>
              <div className="text-center p-6 bg-slate-900/30 rounded-lg border border-amber-900/20">
                <div className="text-3xl font-bold text-amber-400 mb-2">$CAX</div>
                <div className="text-amber-100/60">Caviar Token</div>
              </div>
              <div className="text-center p-6 bg-slate-900/30 rounded-lg border border-amber-900/20">
                <div className="text-3xl font-bold text-amber-400 mb-2">Live</div>
                <div className="text-amber-100/60">Market Data</div>
              </div>
              <div className="text-center p-6 bg-slate-900/30 rounded-lg border border-amber-900/20">
                <div className="text-3xl font-bold text-amber-400 mb-2">Play</div>
                <div className="text-amber-100/60">Genesis Caviar</div>
              </div>
            </div>

            {/* How It Works */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-amber-100 text-center mb-8">Getting Started</h2>
              <div className="space-y-6">
                <Card className="bg-slate-900/30 border-amber-900/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-amber-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                      <div>
                        <h3 className="text-xl font-bold text-amber-100 mb-2">Create Your Account</h3>
                        <p className="text-amber-100/70">Sign up to join the GenesisHQ community. Get instant access to the platform and receive your unique wallet address.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/30 border-amber-900/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-amber-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                      <div>
                        <h3 className="text-xl font-bold text-amber-100 mb-2">Explore & Engage</h3>
                        <p className="text-amber-100/70">Browse Leonardo NFTs, track live investments, join the Codex Collective community, and play Genesis Caviar game.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/30 border-amber-900/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-amber-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                      <div>
                        <h3 className="text-xl font-bold text-amber-100 mb-2">Mint & Collect</h3>
                        <p className="text-amber-100/70">Mint your Leonardo da Vinci NFT, accumulate $CAX tokens, and unlock exclusive community benefits.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-amber-600/20 text-amber-400 border-amber-600/30 px-4 py-2">
                  <Wallet className="w-4 h-4 mr-2 inline" />
                  Your Financial Command Center
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">Wallet & Banking Ecosystem</h2>
                <p className="text-xl text-amber-100/70 max-w-3xl mx-auto">
                  A complete neo-banking solution combining traditional finance with Web3 innovation
                </p>
              </div>

              {/* Banking Features */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="bg-slate-900/50 border-amber-900/30 hover:border-amber-600/50 transition-all">
                  <CardHeader>
                    <Wallet className="w-12 h-12 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100">Multi-Currency Wallet</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2 text-sm">
                      <li>✓ AED, USD, EUR, NOK accounts</li>
                      <li>✓ Crypto & fiat in one place</li>
                      <li>✓ Real-time conversion</li>
                      <li>✓ Secure cold storage</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-amber-900/30 hover:border-amber-600/50 transition-all">
                  <CardHeader>
                    <TrendingUp className="w-12 h-12 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100">Investment Hub</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2 text-sm">
                      <li>✓ Live crypto & stock prices</li>
                      <li>✓ Portfolio tracking</li>
                      <li>✓ Advanced analytics</li>
                      <li>✓ Auto-invest features</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-amber-900/30 hover:border-amber-600/50 transition-all">
                  <CardHeader>
                    <Lock className="w-12 h-12 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100">Licensed Banking</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2 text-sm">
                      <li>✓ VARA VASP licensed</li>
                      <li>✓ UAE banking license</li>
                      <li>✓ PCI-DSS compliant</li>
                      <li>✓ Insured deposits</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {/* Live Crypto Prices */}
              <Tabs defaultValue="crypto" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-900/50">
                  <TabsTrigger value="crypto" className="data-[state=active]:bg-amber-600">Cryptocurrency</TabsTrigger>
                  <TabsTrigger value="banking" className="data-[state=active]:bg-amber-600">Banking Services</TabsTrigger>
                </TabsList>
                
                <TabsContent value="crypto" className="mt-6">
                  <h3 className="text-2xl font-bold text-amber-100 mb-4">Live Market Prices</h3>
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
                              Invest
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="banking" className="mt-6">
                  <h3 className="text-2xl font-bold text-amber-100 mb-6">Banking Services</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-slate-900/50 border-amber-900/30">
                      <CardHeader>
                        <CardTitle className="text-amber-100">Debit Cards</CardTitle>
                      </CardHeader>
                      <CardContent className="text-amber-100/70">
                        <p className="mb-4">Physical and virtual cards with global acceptance</p>
                        <ul className="space-y-2 text-sm">
                          <li>✓ Visa & Mastercard</li>
                          <li>✓ Spend crypto & fiat</li>
                          <li>✓ Cashback rewards</li>
                          <li>✓ Apple Pay & Google Pay</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-amber-900/30">
                      <CardHeader>
                        <CardTitle className="text-amber-100">Fiat On/Off Ramps</CardTitle>
                      </CardHeader>
                      <CardContent className="text-amber-100/70">
                        <p className="mb-4">Seamless conversion between fiat and crypto</p>
                        <ul className="space-y-2 text-sm">
                          <li>✓ Instant conversions</li>
                          <li>✓ Low fees (0.5%)</li>
                          <li>✓ Bank transfers</li>
                          <li>✓ Credit card deposits</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-amber-900/30">
                      <CardHeader>
                        <CardTitle className="text-amber-100">IBANs & Wire Transfers</CardTitle>
                      </CardHeader>
                      <CardContent className="text-amber-100/70">
                        <p className="mb-4">Multi-currency IBAN accounts</p>
                        <ul className="space-y-2 text-sm">
                          <li>✓ UAE IBAN</li>
                          <li>✓ European IBAN</li>
                          <li>✓ SWIFT transfers</li>
                          <li>✓ SEPA payments</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-amber-900/30">
                      <CardHeader>
                        <CardTitle className="text-amber-100">Savings & Staking</CardTitle>
                      </CardHeader>
                      <CardContent className="text-amber-100/70">
                        <p className="mb-4">Earn passive income on your holdings</p>
                        <ul className="space-y-2 text-sm">
                          <li>✓ Up to 8% APY on stablecoins</li>
                          <li>✓ $CAX staking rewards</li>
                          <li>✓ Auto-compound options</li>
                          <li>✓ Flexible withdrawals</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Coming Soon Banner */}
              <Card className="mt-12 bg-gradient-to-r from-amber-600/20 to-amber-900/20 border-amber-600/50">
                <CardContent className="py-8 text-center">
                  <h3 className="text-2xl font-bold text-amber-100 mb-3">Full Banking Launch - Q2 2026</h3>
                  <p className="text-amber-100/70 mb-4">Complete neo-banking platform with licensed operations in UAE and Norway</p>
                  <Badge className="bg-amber-600 text-white px-4 py-2">Phase 2: Genesis NEXUS</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'caviar' && (
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Hero */}
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-amber-600/20 text-amber-400 border-amber-600/30 px-4 py-2">
                  <Zap className="w-4 h-4 mr-2 inline" />
                  The Power of the Ecosystem
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold text-amber-100 mb-4">
                  Caviar Token ($CAX)
                </h2>
                <p className="text-xl md:text-2xl text-amber-100/80 max-w-3xl mx-auto mb-8">
                  Your key to governance, staking rewards, and platform participation. Shape the future of GenesisHQ.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600">
                    <Zap className="w-5 h-5 mr-2" />
                    Buy $CAX
                  </Button>
                  <Button size="lg" variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-600/10">
                    <Trophy className="w-5 h-5 mr-2" />
                    Stake Now
                  </Button>
                </div>
              </div>

              {/* Token Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-16">
                <Card className="bg-slate-900/50 border-amber-900/30 text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-amber-400 mb-2">1B</div>
                    <div className="text-amber-100/60 text-sm">Total Supply</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-amber-900/30 text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-amber-400 mb-2">20%</div>
                    <div className="text-amber-100/60 text-sm">Base APY</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-amber-900/30 text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-amber-400 mb-2">2x</div>
                    <div className="text-amber-100/60 text-sm">G Lounge Boost</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-amber-900/30 text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-amber-400 mb-2">1%</div>
                    <div className="text-amber-100/60 text-sm">Burn Rate</div>
                  </CardContent>
                </Card>
              </div>

              {/* Token Utilities */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold text-amber-100 text-center mb-8">Token Utilities</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-600/30">
                    <CardHeader>
                      <Zap className="w-12 h-12 text-amber-500 mb-3" />
                      <CardTitle className="text-amber-100 text-xl">Governance</CardTitle>
                    </CardHeader>
                    <CardContent className="text-amber-100/70">
                      <p className="mb-3">Vote on platform decisions and shape GenesisHQ's future</p>
                      <ul className="space-y-2 text-sm">
                        <li>✓ Proposal voting rights</li>
                        <li>✓ Treasury allocation decisions</li>
                        <li>✓ Feature prioritization</li>
                        <li>✓ Community initiatives</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-600/30">
                    <CardHeader>
                      <Trophy className="w-12 h-12 text-amber-500 mb-3" />
                      <CardTitle className="text-amber-100 text-xl">Staking Rewards</CardTitle>
                    </CardHeader>
                    <CardContent className="text-amber-100/70">
                      <p className="mb-3">Earn passive income by staking your $CAX tokens</p>
                      <ul className="space-y-2 text-sm">
                        <li>✓ 20% base APY</li>
                        <li>✓ +10% with NFT holder bonus</li>
                        <li>✓ +10% for 6-month lock</li>
                        <li>✓ 2x boost for G Lounge members</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-600/30">
                    <CardHeader>
                      <Users className="w-12 h-12 text-amber-500 mb-3" />
                      <CardTitle className="text-amber-100 text-xl">Platform Access</CardTitle>
                    </CardHeader>
                    <CardContent className="text-amber-100/70">
                      <p className="mb-3">$CAX unlocks exclusive platform features and benefits</p>
                      <ul className="space-y-2 text-sm">
                        <li>✓ P2E game entry fees</li>
                        <li>✓ Tournament participation</li>
                        <li>✓ Premium feature access</li>
                        <li>✓ Reduced trading fees</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-600/30">
                    <CardHeader>
                      <Gem className="w-12 h-12 text-amber-500 mb-3" />
                      <CardTitle className="text-amber-100 text-xl">NFT Benefits</CardTitle>
                    </CardHeader>
                    <CardContent className="text-amber-100/70">
                      <p className="mb-3">NFT holders receive enhanced $CAX rewards and bonuses</p>
                      <ul className="space-y-2 text-sm">
                        <li>✓ Bonus token allocation</li>
                        <li>✓ Enhanced staking APY</li>
                        <li>✓ Priority access to IDO</li>
                        <li>✓ Exclusive airdrops</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Tokenomics */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold text-amber-100 text-center mb-8">Tokenomics Distribution</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-slate-900/50 border-emerald-600/30">
                    <CardHeader>
                      <CardTitle className="text-amber-100 text-center">50%</CardTitle>
                      <CardDescription className="text-center text-amber-100/60">Codex Collective</CardDescription>
                    </CardHeader>
                    <CardContent className="text-amber-100/70 text-center">
                      <p className="text-sm">Reserved for community governance, rewards, and collaborative projects</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-amber-600/30">
                    <CardHeader>
                      <CardTitle className="text-amber-100 text-center">30%</CardTitle>
                      <CardDescription className="text-center text-amber-100/60">Liquidity</CardDescription>
                    </CardHeader>
                    <CardContent className="text-amber-100/70 text-center">
                      <p className="text-sm">DEX liquidity pools and market making operations</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-purple-600/30">
                    <CardHeader>
                      <CardTitle className="text-amber-100 text-center">20%</CardTitle>
                      <CardDescription className="text-center text-amber-100/60">Growth Jar</CardDescription>
                    </CardHeader>
                    <CardContent className="text-amber-100/70 text-center">
                      <p className="text-sm">Marketing, partnerships, ecosystem development</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Deflationary Mechanism */}
              <Card className="bg-gradient-to-r from-amber-600/20 to-amber-900/20 border-amber-600/50 mb-12">
                <CardContent className="py-12">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                    <h3 className="text-3xl font-bold text-amber-100 mb-4">Deflationary Design</h3>
                    <p className="text-xl text-amber-100/80 mb-6 max-w-2xl mx-auto">
                      1% of every transaction is permanently burnt, making $CAX increasingly scarce over time
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div>
                        <div className="text-2xl font-bold text-amber-400 mb-2">Burn</div>
                        <p className="text-sm text-amber-100/60">1% per transaction</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-amber-400 mb-2">Scarcity</div>
                        <p className="text-sm text-amber-100/60">Decreasing supply</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-amber-400 mb-2">Value</div>
                        <p className="text-sm text-amber-100/60">Long-term appreciation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Roadmap Integration */}
              <Card className="bg-slate-900/50 border-amber-900/30">
                <CardHeader>
                  <CardTitle className="text-amber-100 text-2xl text-center">$CAX Launch Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold flex-shrink-0">Q1</div>
                      <div>
                        <h4 className="font-bold text-amber-100 mb-1">2026 - Token Generation</h4>
                        <p className="text-amber-100/70 text-sm">$CAX launch on Solana, initial DEX listings, staking pools activated</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-amber-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold flex-shrink-0">Q2</div>
                      <div>
                        <h4 className="font-bold text-amber-100 mb-1">2026 - Platform Integration</h4>
                        <p className="text-amber-100/70 text-sm">Game wagering enabled, governance portal live, CEX listings</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold flex-shrink-0">Q3</div>
                      <div>
                        <h4 className="font-bold text-amber-100 mb-1">2026+ - Ecosystem Expansion</h4>
                        <p className="text-amber-100/70 text-sm">Cross-chain bridges, institutional partnerships, global adoption</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4 mb-6">
                        <h4 className="text-amber-300 font-bold mb-2 flex items-center">
                          <Crown className="w-5 h-5 mr-2" />
                          Lifetime Benefits
                        </h4>
                        <ul className="text-sm text-amber-100/70 space-y-1">
                          <li>✓ Permanent voting rights in Codex Collective</li>
                          <li>✓ Lifetime access to exclusive community features</li>
                          <li>✓ Enhanced $CAX staking rewards forever</li>
                          <li>✓ Priority access to all future drops</li>
                        </ul>
                      </div>
                      
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
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 mb-3"
                        size="lg"
                      >
                        {user ? 'Mint NFT (Testnet)' : 'Login to Mint'}
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
                      <li>• Community members get premium rates</li>
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
                      {user && (
                        <p className="text-xs text-amber-100/60 text-center">
                          Wallet: {user.walletAddress?.slice(0, 12)}...
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
                  <h2 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4">
                    Welcome to G Lounge
                  </h2>
                  <p className="text-2xl md:text-3xl text-amber-400 mb-6">
                    Home of the Codex Collective
                  </p>
                  <p className="text-xl md:text-2xl text-amber-100/80 max-w-3xl mx-auto mb-8">
                    An exclusive community where Renaissance thinking meets modern innovation. Join elite visionaries, creators, and collectors in the ultimate members club.
                  </p>
                  <Badge className="bg-amber-600/30 text-amber-200 px-6 py-3 text-lg border border-amber-500/30">
                    Premium Membership - Coming Soon
                  </Badge>
                </div>
              </div>

              {/* What is Codex Collective */}
              <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-600/30 mb-12">
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-amber-100 mb-4">G Lounge: Home of the Codex Collective</h3>
                  <p className="text-amber-100/80 text-lg leading-relaxed mb-4">
                    The G Lounge is GenesisHQ's exclusive members club, housing the prestigious Codex Collective. Inspired by Leonardo da Vinci's codices—his notebooks of revolutionary ideas—this is a modern-day gathering of elite minds where Renaissance thinking meets Web3 innovation.
                  </p>
                  <p className="text-amber-100/80 text-lg leading-relaxed">
                    Here, members share knowledge, collaborate on groundbreaking projects, and push the boundaries of what's possible in blockchain, art, and technology. This isn't just a community—it's a movement of visionaries shaping the future.
                  </p>
                </CardContent>
              </Card>

              {/* Benefits Grid */}
              <h3 className="text-3xl font-bold text-amber-100 text-center mb-8">Member Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <MessageSquare className="w-10 h-10 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Private Forums</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2">
                      <li>• Exclusive discussion channels</li>
                      <li>• Direct access to thought leaders</li>
                      <li>• Member-curated content</li>
                      <li>• Real-time collaboration spaces</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <BookOpen className="w-10 h-10 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Knowledge Library</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2">
                      <li>• Exclusive research papers</li>
                      <li>• Industry whitepapers</li>
                      <li>• Educational workshops</li>
                      <li>• Expert masterclasses</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <Users className="w-10 h-10 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Networking Events</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2">
                      <li>• Virtual and in-person meetups</li>
                      <li>• Collaboration opportunities</li>
                      <li>• Project showcases</li>
                      <li>• Industry connections</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <Lightbulb className="w-10 h-10 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Innovation Labs</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2">
                      <li>• Collaborative project incubation</li>
                      <li>• Access to development resources</li>
                      <li>• Mentorship programs</li>
                      <li>• Early alpha testing</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <Zap className="w-10 h-10 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Premium Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2">
                      <li>• MAX Trading Bot access</li>
                      <li>• Advanced analytics dashboard</li>
                      <li>• Portfolio management tools</li>
                      <li>• Market insights & signals</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <Trophy className="w-10 h-10 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Exclusive Perks</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <ul className="space-y-2">
                      <li>• Early NFT drop access</li>
                      <li>• Enhanced staking rewards (2x)</li>
                      <li>• Reduced platform fees</li>
                      <li>• Priority support</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Join CTA */}
              <Card className="bg-gradient-to-r from-amber-600/20 to-amber-900/20 border-amber-600/50">
                <CardContent className="py-12 text-center">
                  <h3 className="text-3xl font-bold text-amber-100 mb-4">Ready to Join the Collective?</h3>
                  <p className="text-amber-100/70 mb-6 max-w-2xl mx-auto">
                    The Codex Collective is launching soon. Be among the first to experience this revolutionary community.
                  </p>
                  {user ? (
                    <div>
                      <Badge className="bg-emerald-600/20 text-emerald-300 px-6 py-3 text-lg border border-emerald-500/30 mb-4">
                        ✓ You'll be notified when we launch
                      </Badge>
                      <p className="text-sm text-amber-100/60">Membership benefits coming soon</p>
                    </div>
                  ) : (
                    <Button 
                      size="lg" 
                      onClick={() => { setAuthMode('register'); setShowAuthModal(true) }}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 px-8"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Join Waitlist
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'game' && (
          <GameComponent user={user} />
        )}

        {activeTab === 'whitepaper' && (
          <WhitepaperSection />
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

// Game Component
function GameComponent({ user }) {
  const canvasRef = React.useRef(null)
  const [gameState, setGameState] = React.useState('menu') // 'menu', 'playing', 'gameover'
  const [score, setScore] = React.useState(0)
  const [playerName, setPlayerName] = React.useState('')
  const gameLoopRef = React.useRef(null)
  const playerRef = React.useRef(null)
  const caviarRef = React.useRef([])
  const enemiesRef = React.useRef([])
  const keysRef = React.useRef({})

  React.useEffect(() => {
    if (user) {
      setPlayerName(user.username)
    }
  }, [user])

  const startGame = () => {
    if (!playerName) {
      alert('Please enter your name')
      return
    }
    
    setScore(0)
    setGameState('playing')
    initGame()
  }

  const initGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Initialize player
    playerRef.current = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 15,
      speed: 3,
      color: '#F59E0B' // Amber color
    }

    // Initialize caviar (food)
    caviarRef.current = []
    for (let i = 0; i < 50; i++) {
      caviarRef.current.push(createCaviar(canvas))
    }

    // Initialize enemies
    enemiesRef.current = []
    for (let i = 0; i < 5; i++) {
      enemiesRef.current.push(createEnemy(canvas))
    }

    // Start game loop
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    gameLoop()
  }

  const createCaviar = (canvas) => {
    return {
      x: Math.random() * (canvas.width - 20) + 10,
      y: Math.random() * (canvas.height - 20) + 10,
      radius: 4 + Math.random() * 3,
      color: `hsl(${30 + Math.random() * 30}, 70%, ${50 + Math.random() * 20}%)` // Orange/amber tones
    }
  }

  const createEnemy = (canvas) => {
    const edge = Math.floor(Math.random() * 4)
    let x, y
    
    switch(edge) {
      case 0: x = Math.random() * canvas.width; y = -30; break
      case 1: x = canvas.width + 30; y = Math.random() * canvas.height; break
      case 2: x = Math.random() * canvas.width; y = canvas.height + 30; break
      case 3: x = -30; y = Math.random() * canvas.height; break
    }

    return {
      x, y,
      radius: 12 + Math.random() * 8,
      speed: 1 + Math.random() * 1.5,
      color: `hsl(${Math.random() * 360}, 60%, 50%)`,
      vx: 0, vy: 0
    }
  }

  const gameLoop = () => {
    const canvas = canvasRef.current
    if (!canvas || gameState !== 'playing') return

    const ctx = canvas.getContext('2d')
    const player = playerRef.current
    if (!player) return

    // Clear canvas with background
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Move player
    if (keysRef.current['w'] || keysRef.current['ArrowUp']) player.y -= player.speed
    if (keysRef.current['s'] || keysRef.current['ArrowDown']) player.y += player.speed
    if (keysRef.current['a'] || keysRef.current['ArrowLeft']) player.x -= player.speed
    if (keysRef.current['d'] || keysRef.current['ArrowRight']) player.x += player.speed

    // Keep player in bounds
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x))
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y))

    // Draw and check caviar collision
    caviarRef.current = caviarRef.current.filter(caviar => {
      const dx = player.x - caviar.x
      const dy = player.y - caviar.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < player.radius + caviar.radius) {
        // Eat caviar
        player.radius += 0.5
        setScore(s => s + 1)
        return false // Remove this caviar
      }

      // Draw caviar as shiny sphere
      const gradient = ctx.createRadialGradient(caviar.x - caviar.radius/3, caviar.y - caviar.radius/3, 0, caviar.x, caviar.y, caviar.radius)
      gradient.addColorStop(0, '#FFF')
      gradient.addColorStop(0.3, caviar.color)
      gradient.addColorStop(1, '#000')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(caviar.x, caviar.y, caviar.radius, 0, Math.PI * 2)
      ctx.fill()

      return true
    })

    // Add new caviar if needed
    while (caviarRef.current.length < 50) {
      caviarRef.current.push(createCaviar(canvas))
    }

    // Move and draw enemies
    enemiesRef.current.forEach(enemy => {
      // AI: Move toward player
      const dx = player.x - enemy.x
      const dy = player.y - enemy.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > 0) {
        enemy.vx = (dx / distance) * enemy.speed
        enemy.vy = (dy / distance) * enemy.speed
      }

      enemy.x += enemy.vx
      enemy.y += enemy.vy

      // Check collision with player
      const collisionDist = Math.sqrt(
        Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
      )

      if (collisionDist < player.radius + enemy.radius) {
        if (player.radius > enemy.radius * 1.2) {
          // Player eats enemy
          enemy.x = Math.random() * canvas.width
          enemy.y = Math.random() * canvas.height
          enemy.radius = 12 + Math.random() * 8
          player.radius += 2
          setScore(s => s + 10)
        } else if (enemy.radius > player.radius * 1.2) {
          // Enemy eats player - game over
          setGameState('gameover')
          submitScore()
          return
        }
      }

      // Draw enemy as glossy caviar sphere
      const gradient = ctx.createRadialGradient(enemy.x - enemy.radius/3, enemy.y - enemy.radius/3, 0, enemy.x, enemy.y, enemy.radius)
      gradient.addColorStop(0, '#FFF')
      gradient.addColorStop(0.4, enemy.color)
      gradient.addColorStop(1, '#000')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2)
      ctx.fill()
      
      // Outline
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Draw player as golden caviar
    const playerGradient = ctx.createRadialGradient(
      player.x - player.radius/3, player.y - player.radius/3, 0,
      player.x, player.y, player.radius
    )
    playerGradient.addColorStop(0, '#FDE68A')
    playerGradient.addColorStop(0.3, '#F59E0B')
    playerGradient.addColorStop(0.7, '#D97706')
    playerGradient.addColorStop(1, '#92400E')
    ctx.fillStyle = playerGradient
    ctx.beginPath()
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2)
    ctx.fill()
    
    // Player outline
    ctx.strokeStyle = '#FCD34D'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw player name
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 14px Inter'
    ctx.textAlign = 'center'
    ctx.fillText(playerName, player.x, player.y - player.radius - 10)

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }

  const submitScore = async () => {
    if (user) {
      try {
        await fetch('/api/game/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: user.walletAddress,
            score: score,
            username: playerName
          })
        })
      } catch (error) {
        console.error('Error submitting score:', error)
      }
    }
  }

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true
    }
    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false
    }

    // Touch controls for mobile
    let touchStartX = 0
    let touchStartY = 0
    
    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      touchStartX = touch.clientX
      touchStartY = touch.clientY
    }
    
    const handleTouchMove = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      const canvas = canvasRef.current
      if (!canvas || !playerRef.current) return
      
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      const targetX = (touch.clientX - rect.left) * scaleX
      const targetY = (touch.clientY - rect.top) * scaleY
      
      const player = playerRef.current
      const dx = targetX - player.x
      const dy = targetY - player.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > 10) {
        player.x += (dx / distance) * player.speed
        player.y += (dy / distance) * player.speed
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    if (canvasRef.current) {
      canvasRef.current.addEventListener('touchstart', handleTouchStart, { passive: false })
      canvasRef.current.addEventListener('touchmove', handleTouchMove, { passive: false })
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('touchstart', handleTouchStart)
        canvasRef.current.removeEventListener('touchmove', handleTouchMove)
      }
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [])

  React.useEffect(() => {
    if (gameState === 'playing' && canvasRef.current && playerRef.current) {
      // Small delay to ensure canvas is fully rendered
      setTimeout(() => {
        gameLoop()
      }, 100)
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState])

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-amber-100 mb-4">Genesis Caviar Game</h2>
          <p className="text-xl text-amber-100/70">
            Grow your caviar by consuming smaller ones. Avoid larger caviar!
          </p>
        </div>

        {gameState === 'menu' && (
          <Card className="bg-slate-900/50 border-amber-900/30 max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <Trophy className="w-24 h-24 text-amber-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-amber-100 mb-4">Ready to Play?</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-amber-100 text-left block mb-2">Your Name</Label>
                  <Input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-slate-800 border-amber-900/30 text-amber-100"
                    maxLength={15}
                  />
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 w-full">
                <Play className="w-5 h-5 mr-2" />
                Start Game
              </Button>
              <div className="mt-6 text-left text-amber-100/60 text-sm">
                <p className="font-semibold mb-2">How to Play:</p>
                <ul className="space-y-1">
                  <li>• Desktop: Use WASD or Arrow Keys</li>
                  <li>• Mobile: Tap and drag to move</li>
                  <li>• Eat smaller caviar to grow</li>
                  <li>• Avoid larger caviar</li>
                  <li>• Grow as big as you can!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {gameState === 'playing' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl font-bold text-amber-100">
                Score: <span className="text-amber-400">{score}</span>
              </div>
              <div className="text-amber-100/70">
                Size: <span className="text-amber-400">{Math.round(playerRef.current?.radius || 0)}</span>
              </div>
            </div>
            <div className="border-4 border-amber-900/30 rounded-lg overflow-hidden bg-slate-950">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-auto max-w-full"
                style={{ touchAction: 'none', minHeight: '300px', display: 'block' }}
              />
            </div>
            <p className="text-center text-amber-100/60 text-sm mt-4">
              Desktop: WASD/Arrow Keys | Mobile: Tap & Drag to move
            </p>
          </div>
        )}

        {gameState === 'gameover' && (
          <Card className="bg-slate-900/50 border-amber-900/30 max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <Trophy className="w-24 h-24 text-amber-500 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-amber-100 mb-4">Game Over!</h3>
              <div className="text-5xl font-bold text-amber-400 mb-2">{score}</div>
              <div className="text-amber-100/60 mb-8">Final Score</div>
              <Button onClick={() => setGameState('menu')} size="lg" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 w-full mb-3">
                Play Again
              </Button>
              {user && (
                <p className="text-sm text-amber-100/60">Score saved to leaderboard</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
