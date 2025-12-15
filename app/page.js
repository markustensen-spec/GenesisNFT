'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Crown, TrendingUp, Wallet, Sparkles, Lock, Zap, Trophy, Users, Gem, ChevronRight, Menu, X, Play, LogIn, UserPlus, LogOut, BookOpen, MessageSquare, Lightbulb, Coins, Loader2, CheckCircle, ExternalLink, Volume2, VolumeX, Star } from 'lucide-react'
import WhitepaperSection from './whitepaper-section'
import { supabase } from '@/lib/supabase'
import { validateEmail, validatePassword, validateUsername, rateLimit, sanitizeInput } from '@/lib/security'
import LazyMintNFT from '@/components/LazyMintNFT'

export default function App() {
  const [activeTab, setActiveTab] = useState('crypto') // NFT page as landing
  const [user, setUser] = useState(null)
  const [cryptoPrices, setCryptoPrices] = useState([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mintStatus, setMintStatus] = useState('')
  const [showEmailPopup, setShowEmailPopup] = useState(false)
  const [whitelistEmail, setWhitelistEmail] = useState('')
  const [whitelistStatus, setWhitelistStatus] = useState('')
  const [stats, setStats] = useState({ totalMinted: 0, remaining: 10000 })
  
  // Auth states
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login', 'register', or 'reset'
  const [authForm, setAuthForm] = useState({ email: '', password: '', username: '' })
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [authError, setAuthError] = useState('')
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false)

  // Check for verification success in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('verified') === 'true') {
        setShowVerificationSuccess(true)
        setShowAuthModal(true)
        setAuthMode('login')
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname)
        // Auto-hide success message after 10 seconds
        setTimeout(() => setShowVerificationSuccess(false), 10000)
      }
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'investments') {
      fetchCryptoPrices()
    }
  }, [activeTab])

  // Check for Supabase session
  useEffect(() => {
    // Only run if supabase client is available (client-side)
    if (!supabase) return

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
          walletAddress: session.user.user_metadata?.wallet_address || 'GeN' + Math.random().toString(36).substring(2, 15),
          emailVerified: session.user.email_confirmed_at !== null
        })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
          walletAddress: session.user.user_metadata?.wallet_address || 'GeN' + Math.random().toString(36).substring(2, 15),
          emailVerified: session.user.email_confirmed_at !== null
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
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

  const fetchNFTStats = async () => {
    try {
      const response = await fetch('/api/nft/stats')
      const data = await response.json()
      if (data.success && data.stats) {
        setStats({
          totalMinted: data.stats.totalMinted || 0,
          remaining: data.stats.remaining || 10000
        })
      }
    } catch (error) {
      console.error('Error fetching NFT stats:', error)
    }
  }

  // Fetch NFT stats when crypto tab is accessed
  useEffect(() => {
    if (activeTab === 'crypto') {
      fetchNFTStats()
    }
  }, [activeTab])

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    
    try {
      if (!supabase) {
        throw new Error('Authentication service is not available')
      }

      // Security: Validate email format
      if (!validateEmail(authForm.email)) {
        throw new Error('Please enter a valid email address')
      }
      
      // Security: Rate limiting (3 attempts per hour per email)
      if (!rateLimit(`reset_${authForm.email}`, 3, 3600000)) {
        throw new Error('Too many password reset attempts. Please try again in an hour.')
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(authForm.email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      
      setResetEmailSent(true)
      setAuthForm({ email: '', password: '', username: '' })
    } catch (error) {
      console.error('Password reset error:', error)
      setAuthError(error.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    
    try {
      if (!supabase) {
        throw new Error('Authentication service is not available')
      }

      if (authMode === 'reset') {
        return handlePasswordReset(e)
      }
      
      if (authMode === 'register') {
        // Security: Validate email
        if (!validateEmail(authForm.email)) {
          throw new Error('Please enter a valid email address')
        }
        
        // Security: Validate password strength
        const passwordValidation = validatePassword(authForm.password)
        if (!passwordValidation.valid) {
          throw new Error(passwordValidation.message)
        }
        
        // Security: Validate username
        if (!validateUsername(authForm.username)) {
          throw new Error('Username must be 3-20 characters (letters, numbers, underscores only)')
        }
        
        // Security: Rate limiting (3 registrations per hour per IP)
        if (!rateLimit(`register_${authForm.email}`, 3, 3600000)) {
          throw new Error('Too many registration attempts. Please try again later.')
        }
        
        // Security: Sanitize username
        const cleanUsername = sanitizeInput(authForm.username)
        
        // Sign up with email verification
        const { data, error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: {
            data: {
              username: cleanUsername,
              wallet_address: 'GeN' + Math.random().toString(36).substring(2, 15)
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?verified=true`
          }
        })

        if (error) {
          console.error('Supabase signup error:', error)
          throw error
        }

        if (data.user) {
          console.log('Registration data:', data)
          
          // Check if email confirmation is required
          if (data.user.identities && data.user.identities.length === 0) {
            setAuthError('This email is already registered. Please try logging in instead.')
          } else {
            // Check if user needs to confirm email
            if (data.user.email_confirmed_at) {
              setShowAuthModal(false)
              setAuthForm({ email: '', password: '', username: '' })
            } else {
              // Show verification message instead of closing modal
              setVerificationEmail(authForm.email)
              setShowVerificationMessage(true)
              setAuthForm({ email: '', password: '', username: '' })
            }
          }
        }
      } else {
        // Login
        // Security: Validate email format
        if (!validateEmail(authForm.email)) {
          throw new Error('Please enter a valid email address')
        }
        
        // Security: Rate limiting (5 login attempts per minute)
        if (!rateLimit(`login_${authForm.email}`, 5, 60000)) {
          throw new Error('Too many login attempts. Please wait a minute and try again.')
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password
        })

        if (error) {
          console.error('Supabase login error:', error)
          throw error
        }

        if (data.user) {
          if (!data.user.email_confirmed_at) {
            await supabase.auth.signOut()
            throw new Error('Email not verified. Please check your inbox and verify your email before logging in.')
          }
          setShowAuthModal(false)
          setAuthForm({ email: '', password: '', username: '' })
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      
      // Better error messages
      let errorMessage = 'Something went wrong. Please try again.'
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.'
      } else if (error.message.includes('Email not verified')) {
        errorMessage = 'Email not verified. Please check your inbox and verify your email before logging in.'
      } else if (error.message.includes('email') && error.message.includes('invalid')) {
        errorMessage = 'Invalid email format. Please enter a valid email address.'
      } else if (error.message.includes('password') && error.message.includes('6')) {
        errorMessage = 'Password too short. Password must be at least 6 characters long.'
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'Email already registered. Please try logging in instead.'
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setAuthError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setActiveTab('home')
  }

  const handleMint = async () => {
    if (!user) {
      alert('Please login to mint NFTs')
      setShowAuthModal(true)
      return
    }
    
    setMintStatus('Creating mint transaction...')
    
    try {
      // Get mint transaction details
      const mintResponse = await fetch('/api/nft/create-mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: user.walletAddress })
      })
      const mintData = await mintResponse.json()
      
      if (!mintData.success) {
        setMintStatus('Failed to create mint transaction')
        return
      }

      // Show treasury wallet and amount
      const treasuryWallet = mintData.treasury
      const amount = mintData.amount
      
      setMintStatus(`Send ${amount} SOL to: ${treasuryWallet.slice(0, 8)}...${treasuryWallet.slice(-4)}`)
      
      // Simulate transaction confirmation (in production, user would send SOL)
      const mockTxSignature = 'mock_tx_' + Math.random().toString(36).substring(2, 15)
      
      setTimeout(async () => {
        setMintStatus('Confirming mint...')
        
        // Confirm mint after payment
        const confirmResponse = await fetch('/api/nft/confirm-mint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletAddress: user.walletAddress,
            txSignature: mockTxSignature
          })
        })
        const confirmData = await confirmResponse.json()
        
        if (confirmData.success) {
          setMintStatus(`✅ Success! Minted: ${confirmData.nft.name}`)
          setTimeout(() => {
            alert(`🎉 NFT Minted Successfully!\n\n${confirmData.nft.name}\n\nPayment sent to treasury:\n${treasuryWallet}`)
          }, 500)
        } else {
          setMintStatus('Mint confirmation failed')
        }
      }, 2000)
      
    } catch (error) {
      setMintStatus('Error: ' + error.message)
    }
  }

  const handleWhitelistSubmit = async (e) => {
    e.preventDefault()
    
    // Security: Validate email
    if (!validateEmail(whitelistEmail)) {
      setWhitelistStatus('Please enter a valid email address')
      return
    }
    
    // Security: Rate limiting (3 whitelist joins per hour per email)
    if (!rateLimit(`whitelist_${whitelistEmail}`, 3, 3600000)) {
      setWhitelistStatus('Too many attempts. Please try again later.')
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('whitelist')
        .insert([{ email: whitelistEmail, verified: false }])
      
      if (error) {
        if (error.code === '23505') {
          setWhitelistStatus('Email already on whitelist')
        } else {
          throw error
        }
      } else {
        setWhitelistStatus('✓ Successfully joined the whitelist!')
        setWhitelistEmail('')
      }
    } catch (error) {
      console.error('Whitelist error:', error)
      setWhitelistStatus('Error joining whitelist. Please try again.')
    }
  }

  const playGame = () => {
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
                  {showVerificationMessage ? 'Verify Your Email' : 
                   resetEmailSent ? 'Check Your Email' :
                   authMode === 'login' ? 'Login to Genesis Nexus7' : 
                   authMode === 'reset' ? 'Reset Password' : 
                   'Create Account'}
                </CardTitle>
                <button onClick={() => {
                  setShowAuthModal(false)
                  setShowVerificationMessage(false)
                  setVerificationEmail('')
                }}>
                  <X className="w-6 h-6 text-amber-400" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {showVerificationMessage ? (
                <div className="space-y-6 py-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-600/20 to-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-emerald-400 mb-4">Welcome to Genesis Nexus7!</h3>
                    <p className="text-xl text-amber-100 mb-2">
                      Your account has been created successfully
                    </p>
                    <p className="text-amber-100/70 mb-4 text-sm">
                      Please verify your email address to complete registration
                    </p>
                    <div className="bg-slate-950/50 border border-emerald-500/30 rounded-lg p-4 mb-6">
                      <p className="text-amber-100/60 text-xs mb-1">Verification email sent to:</p>
                      <p className="text-emerald-400 font-semibold text-lg break-all">
                        {verificationEmail}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-amber-600/20 rounded-xl p-5 space-y-4">
                    <h4 className="text-amber-100 font-bold text-center mb-4 text-lg">📋 Next Steps</h4>
                    
                    <div className="flex items-start space-x-4 bg-slate-950/50 rounded-lg p-4 border border-amber-900/20">
                      <div className="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center">
                        <span className="text-amber-400 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h5 className="text-amber-100 font-semibold mb-1">Check Your Email</h5>
                        <p className="text-amber-100/60 text-sm">
                          Open your inbox and look for an email from Genesis Nexus7/Supabase
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 bg-slate-950/50 rounded-lg p-4 border border-amber-900/20">
                      <div className="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center">
                        <span className="text-amber-400 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h5 className="text-amber-100 font-semibold mb-1">Click Verification Link</h5>
                        <p className="text-amber-100/60 text-sm">
                          Click the "Confirm your email" button in the email
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 bg-slate-950/50 rounded-lg p-4 border border-amber-900/20">
                      <div className="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center">
                        <span className="text-amber-400 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h5 className="text-amber-100 font-semibold mb-1">Return and Login</h5>
                        <p className="text-amber-100/60 text-sm">
                          After verification, come back and log in to access your account
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-900/10 border border-amber-600/30 rounded-lg p-4 flex items-start space-x-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <h5 className="text-amber-300 font-semibold mb-1 text-sm">Can't find the email?</h5>
                      <p className="text-amber-100/60 text-xs mb-2">
                        Check your spam/junk folder. If you still don't see it, click the button below to resend.
                      </p>
                    </div>
                  </div>

                  {resendSuccess && (
                    <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-lg p-4 text-emerald-400 text-sm text-center animate-fade-in">
                      <span className="font-semibold">✓ Verification email resent successfully!</span>
                      <p className="text-xs text-emerald-400/70 mt-1">Check your inbox and spam folder</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={async () => {
                        try {
                          if (!supabase) {
                            throw new Error('Authentication service is not available')
                          }
                          setResendSuccess(false)
                          const { error } = await supabase.auth.resend({
                            type: 'signup',
                            email: verificationEmail
                          })
                          if (error) throw error
                          setResendSuccess(true)
                          setTimeout(() => setResendSuccess(false), 5000)
                        } catch (error) {
                          console.error('Resend error:', error)
                        }
                      }}
                      className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg font-medium text-sm transition-all border border-amber-600/20 hover:border-amber-600/40"
                    >
                      📧 Resend Verification Email
                    </button>
                    
                    <Button 
                      onClick={() => {
                        setShowVerificationMessage(false)
                        setAuthMode('login')
                      }}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-6"
                    >
                      I've Verified My Email - Go to Login
                    </Button>
                  </div>
                </div>
              ) : resetEmailSent ? (
                <div className="space-y-6 py-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-amber-100 mb-3">✓ Reset Email Sent!</h3>
                    <p className="text-amber-100/80 mb-6">
                      We've sent a password reset link to your email. Check your inbox and click the link to set a new password.
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      setResetEmailSent(false)
                      setAuthMode('login')
                    }}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    Back to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleAuth} className="space-y-4">
                {showVerificationSuccess && authMode === 'login' && (
                  <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-lg p-4 text-emerald-400 text-sm animate-fade-in">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">Email Verified Successfully!</span>
                    </div>
                    <p className="text-emerald-400/80 text-xs">
                      Your email has been confirmed. You can now log in to your account.
                    </p>
                  </div>
                )}
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
                {authMode !== 'reset' && (
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
                )}
                {authError && (
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                    {authError}
                  </div>
                )}
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {authMode === 'login' ? 'Logging in...' : authMode === 'reset' ? 'Sending...' : 'Creating account...'}
                    </span>
                  ) : (
                    authMode === 'login' ? 'Login' : authMode === 'reset' ? 'Send Reset Link' : 'Create Account'
                  )}
                </Button>
                
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('reset')
                      setAuthError('')
                      setAuthForm({ email: '', password: '', username: '' })
                    }}
                    className="w-full text-sm text-amber-400/70 hover:text-amber-300"
                  >
                    Forgot password?
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="w-full text-sm text-amber-400 hover:text-amber-300"
                >
                  {authMode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
                </button>
                
                {authMode === 'login' && (
                  <>
                    {resendSuccess && (
                      <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-lg p-2 text-emerald-400 text-xs text-center">
                        ✓ Email sent! Check your inbox and spam folder.
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        if (!authForm.email) {
                          setAuthError('Please enter your email first')
                          return
                        }
                        if (!supabase) {
                          setAuthError('Authentication service is not available')
                          return
                        }
                        try {
                          setResendSuccess(false)
                          const { error } = await supabase.auth.resend({
                            type: 'signup',
                            email: authForm.email
                          })
                          if (error) throw error
                          setResendSuccess(true)
                          setTimeout(() => setResendSuccess(false), 5000)
                        } catch (error) {
                          setAuthError('Could not send email: ' + error.message)
                        }
                      }}
                      className="w-full text-xs text-amber-400/70 hover:text-amber-300 mt-2"
                    >
                      📧 Didn't receive verification email? Click here
                    </button>
                  </>
                )}
                
                {authMode === 'reset' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login')
                      setAuthError('')
                      setAuthForm({ email: '', password: '', username: '' })
                    }}
                    className="w-full text-sm text-amber-400/70 hover:text-amber-300"
                  >
                    ← Back to Login
                  </button>
                )}
                
                {authMode !== 'reset' && (
                  <div className="text-center pt-4 border-t border-amber-900/30">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(authMode === 'login' ? 'register' : 'login')
                        setAuthError('')
                        setAuthForm({ email: '', password: '', username: '' })
                      }}
                      className="text-sm text-amber-400/70 hover:text-amber-300"
                    >
                      {authMode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
                    </button>
                  </div>
                )}
              </form>
            )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Email Whitelist Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900 border-amber-900/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-amber-100">Join NFT Whitelist</CardTitle>
                <button onClick={() => {
                  setShowEmailPopup(false)
                  setWhitelistStatus('')
                }}>
                  <X className="w-6 h-6 text-amber-400" />
                </button>
              </div>
              <CardDescription className="text-amber-100/60">
                Get priority access to mint Leonardo da Vinci NFTs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={async (e) => {
                e.preventDefault()
                setWhitelistStatus('Joining whitelist...')
                
                try {
                  const { data, error } = await supabase
                    .from('whitelist')
                    .insert([{ email: whitelistEmail }])
                    .select()
                  
                  if (error) {
                    if (error.code === '23505') {
                      setWhitelistStatus('✓ You are already on the whitelist!')
                    } else {
                      throw error
                    }
                  } else {
                    setWhitelistStatus('✓ Successfully joined the whitelist! Check your email for confirmation.')
                  }
                  
                  setWhitelistEmail('')
                  setTimeout(() => {
                    setShowEmailPopup(false)
                    setWhitelistStatus('')
                  }, 3000)
                } catch (error) {
                  setWhitelistStatus('❌ Error: ' + error.message)
                }
              }} className="space-y-4">
                <div>
                  <Label className="text-amber-100">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={whitelistEmail}
                    onChange={(e) => setWhitelistEmail(e.target.value)}
                    className="bg-slate-800 border-amber-900/30 text-amber-100 mt-2"
                    required
                  />
                </div>
                {whitelistStatus && (
                  <p className={`text-sm ${whitelistStatus.includes('✓') ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {whitelistStatus}
                  </p>
                )}
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                  Join Whitelist
                </Button>
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
              <img 
                src="/images/noir-logo.png" 
                alt="Noir97 Logo" 
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
              <span className="text-lg md:text-xl font-semibold text-slate-100">
                Noir97
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
              <Button variant="ghost" onClick={() => setActiveTab('crypto')} className="text-amber-100 hover:text-amber-400">
                NFT
              </Button>
              <Button variant="ghost" onClick={playGame} className="text-amber-100 hover:text-amber-400">
                G Lounge
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
              <Button variant="ghost" onClick={() => { setActiveTab('crypto'); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                NFT
              </Button>
              <Button variant="ghost" onClick={() => { playGame(); setMobileMenuOpen(false) }} className="w-full text-amber-100">
                G Lounge
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
          <div className="w-full">
            <div className="container mx-auto px-4 max-w-7xl">
              {/* Hero Section with Background */}
              <div 
                className="relative mb-16 rounded-2xl overflow-hidden mx-auto"
                style={{
                  backgroundImage: `url('https://customer-assets.emergentagent.com/job_genesishq-web3/artifacts/7uu3db8w_grok_image_o8f8mx.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950"></div>
                <div className="relative text-center py-20 px-4 animate-fade-in">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                    Genesis Nexus7
                  </h1>
                  <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto mb-8 drop-shadow-lg">
                    Your money, your power, one Nexus.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {!user && (
                      <Button size="lg" onClick={() => { setAuthMode('register'); setShowAuthModal(true) }} className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-8 shadow-xl">
                        <UserPlus className="w-5 h-5 mr-2" />
                        Join Genesis Nexus7
                      </Button>
                    )}
                    <Button size="lg" onClick={playGame} className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-8 shadow-xl">
                      <Play className="w-5 h-5 mr-2" />
                      Play Arena
                    </Button>
                  </div>
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
                    <CardTitle className="text-amber-100 text-2xl">Caviar</CardTitle>
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

                <Card className="bg-slate-900/50 border-emerald-900/30 backdrop-blur-sm hover:border-emerald-600/50 transition-all cursor-pointer" onClick={playGame}>
                  <CardHeader>
                    <Trophy className="w-16 h-16 text-emerald-500 mb-4" />
                    <CardTitle className="text-amber-100 text-2xl">G Lounge</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">
                      All-in-One Crypto Platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-4 text-base">Premium crypto tools, trading automation, and Play-to-Earn gaming experiences!</p>
                    <ul className="space-y-2">
                      <li>✓ Codex Collective community insights</li>
                      <li>✓ Trading Bot MAX automation</li>
                      <li>✓ Play-to-Earn games with crypto rewards</li>
                      <li>✓ Caviar Golf Hub (Powered by CAX)</li>
                      <li>✓ Global leaderboards & tournaments</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm hover:border-blue-600/50 transition-all cursor-pointer" onClick={() => setActiveTab('lounge')}>
                  <CardHeader>
                    <Zap className="w-16 h-16 text-blue-500 mb-4" />
                    <CardTitle className="text-amber-100 text-2xl">MAX Trading Bot</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">
                      AI-powered automated trading
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-4 text-base">Advanced AI trading bot that executes 24/7 automated cryptocurrency trading with sophisticated algorithms and risk management.</p>
                    <ul className="space-y-2">
                      <li>✓ 24/7 automated trading operations</li>
                      <li>✓ Advanced risk management systems</li>
                      <li>✓ Multi-exchange support & arbitrage</li>
                      <li>✓ Real-time portfolio optimization</li>
                      <li>✓ Customizable trading strategies</li>
                    </ul>
                  </CardContent>
                </Card>
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
                          <p className="text-amber-100/70">Sign up to join the Genesis Nexus7 community. Get instant access to the platform and receive your unique wallet address.</p>
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
                          <p className="text-amber-100/70">Browse Leonardo NFTs, track live investments, join the Codex Collective community, and explore G Lounge.</p>
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
                          <p className="text-amber-100/70">Mint your Leonardo da Vinci NFT and unlock exclusive community benefits.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="w-full">
            <div className="container mx-auto px-4 max-w-7xl">
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

              {/* Banking Certification Notice */}
              <Card className="bg-gradient-to-r from-amber-900/20 to-emerald-900/20 border-amber-600/30 mb-12">
                <CardContent className="p-6">
                  <p className="text-amber-100 text-center text-lg leading-relaxed">
                    With funding in place, the next step is the seamless acquisition of full banking and operational certifications to launch regulated services.
                  </p>
                </CardContent>
              </Card>
              
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
                          <li>✓ Staking rewards</li>
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

        {false && activeTab === 'caviar' && (
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Hero with Background */}
              <div 
                className="relative mb-16 rounded-2xl overflow-hidden"
                style={{
                  backgroundImage: `url('https://customer-assets.emergentagent.com/job_genesishq/artifacts/kum9el5i_grok_image_39m5w5.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950"></div>
                <div className="relative text-center py-20 px-4">
                  <Badge className="mb-4 bg-amber-600/40 text-amber-300 border-amber-600/50 px-4 py-2 backdrop-blur-sm">
                    <Zap className="w-4 h-4 mr-2 inline" />
                    The Power of the Ecosystem
                  </Badge>
                  <h2 className="text-4xl md:text-6xl font-bold text-amber-100 mb-4 drop-shadow-lg">
                    Caviar Token ($CAX) - Dropping February 14
                  </h2>
                  <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto mb-8 drop-shadow-lg">
                    Your key to governance, staking rewards, and platform participation. Shape the future of Genesis Nexus7.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-xl" disabled>
                      <Zap className="w-5 h-5 mr-2" />
                      Live February 14
                    </Button>
                    <Button size="lg" variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-600/10 backdrop-blur-sm" disabled>
                      <Trophy className="w-5 h-5 mr-2" />
                      Live February 14
                    </Button>
                  </div>
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
                    <div className="text-amber-100/60 text-sm">Caviar Boost</div>
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
                      <p className="mb-3">Vote on platform decisions and shape Genesis Nexus7's future</p>
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
                        <li>✓ 2x boost for Caviar members</li>
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

        {activeTab === 'crypto' && (
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* MAIN MINTING HERO SECTION */}
              {/* New Introduction */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  Leonardo Da Vinci NFT
                </h1>
                <p className="text-2xl md:text-3xl text-amber-100 font-bold mb-3">
                  Genesis Codex
                </p>
                <p className="text-xl md:text-2xl text-amber-100/80">
                  10.000 unique pieces on Solana
                </p>
              </div>

              <div className="relative mb-12 rounded-3xl overflow-hidden border-4 border-amber-600/60 shadow-2xl">
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('https://customer-assets.emergentagent.com/job_genesishq-web3/artifacts/nu4vi62t_images%20%281%29.jpeg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.25)'
                  }}
                />
                <div className="relative text-center py-16 px-6">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-amber-100 drop-shadow-2xl">
                    Mint your NFT
                  </h2>
                  
                  <p className="text-xl md:text-2xl text-amber-100 mb-2 font-bold drop-shadow-lg">
                    Genesis Codex <span className="text-amber-400">›</span> 9500
                  </p>
                  <p className="text-xl md:text-2xl text-amber-100 mb-8 font-bold drop-shadow-lg">
                    Atlanticus <span className="text-amber-400">›</span> 500
                  </p>

                  {/* Price & Stats - Compact & Elegant */}
                  <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <div className="bg-gradient-to-br from-amber-900/80 to-amber-950/80 backdrop-blur-xl px-6 py-4 rounded-xl border border-amber-500/50 shadow-lg">
                      <div className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">Mint Price</div>
                      <div className="text-2xl font-bold text-white">0.5 SOL</div>
                      <div className="text-emerald-400 text-xs">Solana Mainnet</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-900/70 to-amber-950/70 backdrop-blur-xl px-6 py-4 rounded-xl border border-yellow-500/50 shadow-lg">
                      <div className="text-yellow-300 text-xs font-semibold uppercase tracking-wider mb-1">🌟 Atlanticus</div>
                      <div className="text-2xl font-bold text-white">500</div>
                      <div className="text-yellow-300/70 text-xs">Special NFTs</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl px-6 py-4 rounded-xl border border-slate-500/50 shadow-lg">
                      <div className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1">📜 Codex</div>
                      <div className="text-2xl font-bold text-white">9,500</div>
                      <div className="text-slate-400 text-xs">Utility NFTs</div>
                    </div>
                  </div>

                  {/* MAIN MINTING SECTION - No login required */}
                  <div className="space-y-6 max-w-3xl mx-auto">
                    <div className="bg-slate-950/95 backdrop-blur-xl rounded-3xl p-8 border-3 border-amber-600/50 shadow-2xl">
                      <LazyMintNFT user={user} />
                    </div>
                    
                    {/* NFT Tier Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 rounded-xl p-4 border border-amber-500/50">
                        <p className="text-amber-300 font-bold text-sm mb-2">🌟 Atlanticus (500)</p>
                        <ul className="text-amber-100/70 text-xs space-y-1">
                          <li>✨ LIFETIME ACCESS</li>
                          <li>📈 8% BONUS APY</li>
                          <li>🎁 Exclusive AIRDROPS</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-4 border border-slate-600/50">
                        <p className="text-slate-300 font-bold text-sm mb-2">📜 Codex NFTs (9,500)</p>
                        <ul className="text-slate-100/70 text-xs space-y-1">
                          <li>✓ Utility NFT</li>
                          <li>✓ Voting Rights</li>
                          <li>✓ Staking Rewards</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NFT Gallery Preview */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-amber-100 mb-6 text-center">Collection Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                  <Card className="bg-slate-900/50 border-amber-900/30 hover:border-amber-600/50 transition-all cursor-pointer">
                    <CardContent className="p-3">
                      <img 
                        src="https://customer-assets.emergentagent.com/job_genesishq/artifacts/e8vx47cp_grok_image_sidn9a.jpg" 
                        alt="Leonardo da Vinci Codex Sketch"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-900/50 border-amber-900/30 hover:border-amber-600/50 transition-all cursor-pointer">
                    <CardContent className="p-3">
                      <img 
                        src="https://customer-assets.emergentagent.com/job_genesishq/artifacts/8bolikx2_grok_image_xwwjcmi-1.jpg" 
                        alt="Leonardo da Vinci Codex Sketch"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-900/50 border-amber-900/30 hover:border-amber-600/50 transition-all cursor-pointer">
                    <CardContent className="p-3">
                      <img 
                        src="https://customer-assets.emergentagent.com/job_genesishq/artifacts/dsa5mpph_grok_image_srmrao.jpg" 
                        alt="Leonardo da Vinci Codex Sketch"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-900/50 border-amber-900/30 hover:border-amber-600/50 transition-all cursor-pointer">
                    <CardContent className="p-3">
                      <img 
                        src="https://customer-assets.emergentagent.com/job_genesishq/artifacts/z8mdzpxa_grok_image_7l8qdo.jpg" 
                        alt="Leonardo da Vinci Codex Sketch"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </div>
                
                {/* Vitruvian Founder NFTs Showcase - 500 Available */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-amber-100 mb-6 text-center">🌟 Atlanticus NFTs - 500 Available</h3>
                  <Card className="bg-gradient-to-br from-yellow-900/30 via-amber-900/30 to-yellow-900/30 border-2 border-amber-500/50 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-2 gap-0">
                        <div className="relative h-80 md:h-auto">
                          <img 
                            src="https://customer-assets.emergentagent.com/job_d276f0f7-c89d-485a-afe5-73673e9f3f01/artifacts/19jx9ydj_Snapchat-2040080020.jpg" 
                            alt="Vitruvian Founder NFT" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4 right-4 text-center">
                            <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-3 rounded-full font-bold text-lg inline-flex items-center gap-2">
                              <Crown className="w-5 h-5" />
                              FOUNDER - 500 TOTAL
                              <Crown className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-950/90">
                          <h4 className="text-3xl font-bold text-amber-200 mb-4">Atlanticus NFT</h4>
                          <p className="text-amber-100/70 text-base mb-4">Leonardo da Vinci's iconic Vitruvian Man - First 500 minters only</p>
                          <div className="flex gap-2 mb-6">
                            <Badge className="bg-amber-600/30 text-amber-200 border-amber-500/50">Rare</Badge>
                            <Badge className="bg-yellow-600/30 text-yellow-200 border-yellow-500/50">Atlanticus</Badge>
                            <Badge className="bg-emerald-600/30 text-emerald-200 border-emerald-500/50">500 of 10,000</Badge>
                          </div>
                          
                          <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-5 mb-4">
                            <h5 className="text-amber-300 font-bold mb-3">Atlanticus Benefits:</h5>
                            <ul className="text-sm text-amber-100/80 space-y-2">
                              <li className="flex items-start">
                                <Sparkles className="w-4 h-4 mr-2 mt-0.5 text-yellow-400" />
                                <span><strong>LIFETIME ACCESS</strong> to all Genesis Nexus7 features</span>
                              </li>
                              <li className="flex items-start">
                                <TrendingUp className="w-4 h-4 mr-2 mt-0.5 text-emerald-400" />
                                <span><strong>8% BONUS APY</strong> on staking rewards</span>
                              </li>
                              <li className="flex items-start">
                                <Gem className="w-4 h-4 mr-2 mt-0.5 text-purple-400" />
                                <span><strong>Exclusive AIRDROPS</strong> for all future drops</span>
                              </li>
                              <li className="flex items-start">
                                <Crown className="w-4 h-4 mr-2 mt-0.5 text-amber-400" />
                                <span><strong>VIP Status</strong> in Codex Collective</span>
                              </li>
                            </ul>
                          </div>
                          
                          <p className="text-amber-100/60 text-sm">
                            Minting is completely random! Every mint has a chance to receive this exclusive Atlanticus NFT with premium benefits. Only 500 exist in the collection.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>


            </div>
          </div>
        )}

        {activeTab === 'crypto' && (
          <div className="container mx-auto px-4 mt-16">
            <div className="max-w-6xl mx-auto">
              {/* Caviar Token Section */}
              <div 
                className="relative mb-16 rounded-2xl overflow-hidden"
                style={{
                  backgroundImage: `url('https://customer-assets.emergentagent.com/job_genesishq/artifacts/kum9el5i_grok_image_39m5w5.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950"></div>
                <div className="relative text-center py-20 px-4">
                  <Badge className="mb-4 bg-amber-600/40 text-amber-300 border-amber-600/50 px-4 py-2 backdrop-blur-sm">
                    <Zap className="w-4 h-4 mr-2 inline" />
                    The Power of the Ecosystem
                  </Badge>
                  <h2 className="text-4xl md:text-6xl font-bold text-amber-100 mb-4 drop-shadow-lg">
                    Caviar Token (&#36;CAX)
                  </h2>
                  <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto mb-8 drop-shadow-lg">
                    Your key to governance, staking rewards, and platform participation. Shape the future of Genesis Nexus7.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-xl opacity-70" disabled>
                      <Zap className="w-5 h-5 mr-2" />
                      Live February 14
                    </Button>
                    <Button size="lg" variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-600/10 backdrop-blur-sm opacity-70" disabled>
                      <Trophy className="w-5 h-5 mr-2" />
                      Live February 14
                    </Button>
                  </div>
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
                    <div className="text-amber-100/60 text-sm">Caviar Boost</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-amber-900/30 text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-amber-400 mb-2">1%</div>
                    <div className="text-amber-100/60 text-sm">Burn Rate</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lounge' && (
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Hero with Background */}
              <div 
                className="relative mb-16 rounded-2xl overflow-hidden"
                style={{
                  backgroundImage: `url('https://customer-assets.emergentagent.com/job_genesishq-web3/artifacts/mf71ik0q_grok_image_qwodnw.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950"></div>
                <div className="relative text-center py-20 px-4">
                  <h2 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 drop-shadow-lg">
                    Caviar Token ($CAX) - Dropping February 14
                  </h2>
                  <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto mb-8 drop-shadow-lg">
                    The governance and utility token powering the Genesis Nexus7 ecosystem
                  </p>
                  
                  {/* Token Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                    <div className="bg-slate-900/70 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30">
                      <div className="text-3xl font-bold text-amber-400">1B</div>
                      <div className="text-amber-100/70 text-sm">Total Supply</div>
                    </div>
                    <div className="bg-slate-900/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30">
                      <div className="text-3xl font-bold text-emerald-400">20%</div>
                      <div className="text-amber-100/70 text-sm">Base APY</div>
                    </div>
                    <div className="bg-slate-900/70 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
                      <div className="text-3xl font-bold text-purple-400">1%</div>
                      <div className="text-amber-100/70 text-sm">Burn Rate</div>
                    </div>
                    <div className="bg-slate-900/70 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
                      <div className="text-3xl font-bold text-yellow-400">SOL</div>
                      <div className="text-amber-100/70 text-sm">Network</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Utility */}
              <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-600/30 mb-12">
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-amber-100 mb-6">$CAX Token Utility</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-8 h-8 text-amber-500" />
                      </div>
                      <h4 className="text-xl font-bold text-amber-100 mb-2">Governance</h4>
                      <p className="text-amber-100/70">Vote on platform decisions, feature proposals, and community initiatives</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h4 className="text-xl font-bold text-amber-100 mb-2">Staking Rewards</h4>
                      <p className="text-amber-100/70">Earn up to 20% APY by staking your $CAX tokens in our pools</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-purple-500" />
                      </div>
                      <h4 className="text-xl font-bold text-amber-100 mb-2">Platform Access</h4>
                      <p className="text-amber-100/70">Unlock premium features, NFT drops, and exclusive member benefits</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tokenomics */}
              <h3 className="text-3xl font-bold text-amber-100 text-center mb-8">Tokenomics</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <TrendingUp className="w-12 h-12 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Staking Pool</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-3">Earn passive income by staking your $CAX tokens</p>
                    <ul className="space-y-2 text-sm">
                      <li>✓ 20% base APY rewards</li>
                      <li>✓ NFT holder bonuses (+8%)</li>
                      <li>✓ No lock-up period</li>
                      <li>✓ Auto-compounding available</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-900/30 to-slate-900/50 border-emerald-600/30">
                  <CardHeader>
                    <Lock className="w-12 h-12 text-emerald-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Platform Access</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-3">$CAX unlocks exclusive platform features</p>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Trading bot access</li>
                      <li>✓ Premium minigames</li>
                      <li>✓ Exclusive NFT drops</li>
                      <li>✓ VIP community access</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border-purple-600/30">
                  <CardHeader>
                    <Gem className="w-12 h-12 text-purple-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">NFT Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-3">NFT holders receive enhanced $CAX rewards</p>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Atlanticus NFT: +8% APY</li>
                      <li>✓ Sketch NFT: +2% APY</li>
                      <li>✓ Exclusive airdrops</li>
                      <li>✓ Governance multiplier</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-900/30 to-slate-900/50 border-red-600/30">
                  <CardHeader>
                    <Zap className="w-12 h-12 text-red-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Deflationary</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-3">1% burn on every transaction</p>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Reduces supply over time</li>
                      <li>✓ Increases scarcity</li>
                      <li>✓ Benefits long-term holders</li>
                      <li>✓ Automatic burn mechanism</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Launch Timeline */}
              <Card className="bg-slate-900/50 border-amber-600/30 mb-12">
                <CardContent className="p-8">
                  <CardTitle className="text-amber-100 text-2xl text-center mb-8">$CAX Launch Timeline</CardTitle>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-emerald-400">Phase 1: Foundation ✓</h4>
                        <p className="text-amber-100/70">NFT collection launch, community building, smart contract development</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Loader2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-amber-400">Phase 2: Token Launch (Current)</h4>
                        <p className="text-amber-100/70">$CAX launch on Pump.fun, initial DEX listings, staking pools activation</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-400">Phase 3: Ecosystem Expansion</h4>
                        <p className="text-amber-100/70">Trading bot launch, minigames integration, CEX listings</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-400">Phase 4: Full Platform</h4>
                        <p className="text-amber-100/70">Banking features, global expansion, mobile app launch</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Codex Collective */}
              <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-600/30 mb-12">
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-amber-100 mb-4">Codex Collective</h3>
                  <p className="text-amber-100/80 text-lg leading-relaxed mb-4">
                    The Caviar community is Genesis Nexus7&apos;s exclusive members club, housing the prestigious Codex Collective. Inspired by Leonardo da Vinci&apos;s codices—his notebooks of revolutionary ideas—this is a modern-day gathering of elite minds where Renaissance thinking meets Web3 innovation.
                  </p>
                  <p className="text-amber-100/80 text-lg leading-relaxed">
                    Here, members share knowledge, collaborate on groundbreaking projects, and push the boundaries of what&apos;s possible in blockchain, art, and technology. This isn&apos;t just a community—it&apos;s a movement of visionaries shaping the future.
                  </p>
                </CardContent>
              </Card>

              {/* New Features Section */}
              <h3 className="text-3xl font-bold text-amber-100 text-center mb-8">Exclusive Features</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="bg-gradient-to-br from-emerald-900/30 to-slate-900/50 border-emerald-600/30">
                  <CardHeader>
                    <Zap className="w-12 h-12 text-emerald-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Trading Bot MAX</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-4">AI-powered trading bot for automated cryptocurrency trading with advanced algorithms.</p>
                    <ul className="space-y-2 text-sm">
                      <li>✓ 24/7 automated trading</li>
                      <li>✓ Advanced risk management</li>
                      <li>✓ Multi-exchange support</li>
                      <li>✓ Real-time portfolio optimization</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border-purple-600/30">
                  <CardHeader>
                    <Users className="w-12 h-12 text-purple-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Inner Circle</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-4">Elite networking group for high-level collaborations and exclusive opportunities.</p>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Private networking events</li>
                      <li>✓ Direct access to founders</li>
                      <li>✓ Early investment opportunities</li>
                      <li>✓ Strategic partnerships</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/30">
                  <CardHeader>
                    <Play className="w-12 h-12 text-amber-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">G Lounge Games</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-4">Collection of Play-to-Earn games with crypto rewards and competitive leaderboards.</p>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Caviar Golf Hub powered by CAX</li>
                      <li>✓ Daily challenges & tournaments</li>
                      <li>✓ NFT rewards for winners</li>
                      <li>✓ Global leaderboards</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/30 to-slate-900/50 border-blue-600/30">
                  <CardHeader>
                    <Crown className="w-12 h-12 text-blue-500 mb-3" />
                    <CardTitle className="text-amber-100 text-xl">Codex Collective</CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-100/70">
                    <p className="mb-4">Where members vote for projects or ideas to fund.</p>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Community-driven funding decisions</li>
                      <li>✓ Vote on innovative projects</li>
                      <li>✓ Shape the ecosystem together</li>
                      <li>✓ Democratic governance system</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

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
          <GLoungeComponent user={user} />
        )}

        {activeTab === 'codexcats' && (
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Hero */}
              <div className="text-center py-16">
                <h2 className="text-5xl md:text-6xl font-bold text-amber-100 mb-8">
                  Codex Collective
                </h2>
              </div>

              {/* Main Introduction */}
              <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-600/30 mb-12">
                <CardContent className="p-8 md:p-12">
                  <div className="prose prose-lg prose-amber max-w-none">
                    <p className="text-xl text-amber-100/90 leading-relaxed mb-6">
                      The Codex Collective is an exclusive, holder-only Community DAO for the Leonardo da Vinci Codex NFT project — a tight-knit circle of visionaries channeling da Vinci's secretive brilliance into Web3 innovation.
                    </p>
                    
                    <p className="text-lg text-amber-100/80 leading-relaxed mb-6">
                      This is strictly community-focused: Only those holding a Leonardo da Vinci Codex NFT gain entry. True commitment drives everything here.
                    </p>

                    <h3 className="text-2xl font-bold text-amber-200 mt-10 mb-6">To bring a business proposal or idea to life:</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-4 bg-slate-800/50 rounded-lg p-4">
                        <span className="text-2xl">1.</span>
                        <p className="text-amber-100/80"><strong className="text-amber-300">Burn one NFT as your stake</strong> — proving skin in the game.</p>
                      </div>
                      
                      <div className="flex items-start gap-4 bg-slate-800/50 rounded-lg p-4">
                        <span className="text-2xl">2.</span>
                        <p className="text-amber-100/80"><strong className="text-amber-300">Face the Sharks</strong> — our ruthless community vote where holders grill and decide your fate.</p>
                      </div>
                      
                      <div className="flex items-start gap-4 bg-slate-800/50 rounded-lg p-4">
                        <span className="text-2xl">3.</span>
                        <p className="text-amber-100/80"><strong className="text-amber-300">If it passes</strong>, your idea is eternally inscribed in the Codex Book — immortalized on-chain for the Collective's legacy.</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-amber-200 mt-10 mb-6">We fund the full spectrum:</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                        <h4 className="text-xl font-bold text-purple-300 mb-3">Meme-fueled chaos</h4>
                        <p className="text-amber-100/70">Community comics based on our wild stories, viral drops, and playful da Vinci twists!</p>
                      </div>
                      
                      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-6">
                        <h4 className="text-xl font-bold text-emerald-300 mb-3">Serious impact</h4>
                        <p className="text-amber-100/70">Museum partnerships, high-art collaborations, metaverse builds, and real-world utilities.</p>
                      </div>
                    </div>

                    <p className="text-lg text-amber-100/80 leading-relaxed mb-6">
                      This elite Collective is mysterious, owner-driven, and unstoppable. Hold your NFT, burn for greatness, survive the Sharks — and etch your mark in history.
                    </p>

                    <div className="bg-gradient-to-r from-amber-600/20 to-amber-900/20 border border-amber-500/50 rounded-xl p-6 text-center mt-10">
                      <p className="text-xl text-amber-200 font-semibold">
                        Ready to propose? Secure your Codex NFT and join the inner circle.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Three Codex Ideas */}
              <h3 className="text-3xl font-bold text-amber-100 text-center mb-8">Current Proposals</h3>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                
                {/* 1. Satellite Time Capsule */}
                <Card className="bg-gradient-to-br from-blue-900/40 to-slate-900/60 border-2 border-blue-500/50 overflow-hidden hover:border-blue-400 transition-all">
                  <div className="h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                    <Sparkles className="w-20 h-20 text-blue-400" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-amber-100 text-xl">Satellite Time Capsule</CardTitle>
                    <CardDescription className="text-blue-300">Codex Idea #1</CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/80">
                    <p className="mb-4 text-sm">Launch a digital time capsule into space! Store messages, art, and memories on a satellite orbiting Earth.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-bold">Goal: $500K</span>
                      <Badge className="bg-blue-600/30 text-blue-200 border-blue-500/50">Voting Soon</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 2. Get Sassy the Sasquatch Back */}
                <Card className="bg-gradient-to-br from-green-900/40 to-slate-900/60 border-2 border-green-500/50 overflow-hidden hover:border-green-400 transition-all">
                  <div className="h-48 bg-gradient-to-br from-green-600/20 to-emerald-600/20 flex items-center justify-center">
                    <Trophy className="w-20 h-20 text-green-400" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-amber-100 text-xl">Get Sassy the Sasquatch Back</CardTitle>
                    <CardDescription className="text-green-300">Codex Idea #2</CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/80">
                    <p className="mb-4 text-sm">Fund the ultimate cryptid expedition! A community-funded search party to find Sassy the legendary Sasquatch.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-bold">Goal: $250K</span>
                      <Badge className="bg-green-600/30 text-green-200 border-green-500/50">Voting Soon</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 3. Invest in the Page */}
                <Card className="bg-gradient-to-br from-amber-900/40 to-slate-900/60 border-2 border-amber-500/50 overflow-hidden hover:border-amber-400 transition-all">
                  <div className="h-48 bg-gradient-to-br from-amber-600/20 to-yellow-600/20 flex items-center justify-center">
                    <TrendingUp className="w-20 h-20 text-amber-400" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-amber-100 text-xl">Invest in the Page</CardTitle>
                    <CardDescription className="text-amber-300">Codex Idea #3</CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/80">
                    <p className="mb-4 text-sm">Become a stakeholder in Genesis Nexus7! Community members can directly invest and share in success.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">Goal: $1M</span>
                      <Badge className="bg-amber-600/30 text-amber-200 border-amber-500/50">Voting Soon</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'whitepaper' && (
          <WhitepaperSection />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-amber-900/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_genesishq-web3/artifacts/wtztw3gp_1000004278.jpg.png" 
              alt="Genesis Nexus7 Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-amber-100">Genesis Nexus7</span>
          </div>
          <p className="text-amber-100/60 mb-4">Where Renaissance Meets Revolution</p>
          <p className="text-sm text-amber-100/40">© 2025 Genesis Nexus7. All rights reserved.</p>
          <div className="mt-4 text-xs text-amber-100/30">
            <p>⚠️ Testnet Environment - Not for Production Use</p>
            <p>Smart contracts require audit before mainnet deployment</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// G Lounge Component - Welcome page with Steam-like social hub and Codex 7 Rules
function GLoungeComponent({ user }) {
  const [activeSection, setActiveSection] = useState('overview')
  const [rulesAccepted, setRulesAccepted] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(true)
  const [showSignup, setShowSignup] = useState(false)
  const [signupEmail, setSignupEmail] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [emailOptIn, setEmailOptIn] = useState(true)
  const [signupStatus, setSignupStatus] = useState('')
  const audioRef = React.useRef(null)
  
  // Check if rules were previously accepted (localStorage)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const accepted = localStorage.getItem('codex7_accepted')
      if (accepted === 'true') {
        setRulesAccepted(true)
      }
    }
  }, [])
  
  // Audio player for G Lounge ambiance
  React.useEffect(() => {
    if (rulesAccepted && typeof window !== 'undefined') {
      audioRef.current = new Audio('/audio/7Days.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
      audioRef.current.play().catch(e => console.log('Audio autoplay prevented'))
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [rulesAccepted])
  
  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setAudioPlaying(!audioPlaying)
    }
  }
  
  const acceptRules = () => {
    localStorage.setItem('codex7_accepted', 'true')
    setRulesAccepted(true)
  }
  
  const handleGLoungeSignup = async () => {
    if (!signupEmail || !signupUsername) {
      setSignupStatus('Please fill in all fields')
      return
    }
    
    setSignupStatus('Creating account...')
    
    try {
      const response = await fetch('/api/glounge-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail,
          username: signupUsername,
          emailOptIn: emailOptIn
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSignupStatus('Welcome to G Lounge! Check your email for confirmation.')
        setShowSignup(false)
        localStorage.setItem('glounge_member', 'true')
      } else {
        setSignupStatus(data.error || 'Something went wrong')
      }
    } catch (error) {
      setSignupStatus('Error creating account. Please try again.')
    }
  }
  
  const codex7Rules = [
    { num: 1, title: "Uncompromising Respect", desc: "Extend courtesy, dignity, and equality to every fellow member, regardless of holdings, skill, or status." },
    { num: 2, title: "Absolute Integrity", desc: "Conduct all wagers, votes, trades, and interactions with complete honesty; deceit in any form is beneath a gentleman." },
    { num: 3, title: "Refined Civility", desc: "Speak and write with poise and restraint; avoid profanity, personal attacks, or any discourse that diminishes the Lounge." },
    { num: 4, title: "Generous Spirit", desc: "Share knowledge, strategies, and encouragement freely, guiding newcomers with the warmth of true camaraderie." },
    { num: 5, title: "Relentless Pursuit of Excellence", desc: "Bring disciplined effort and sportsmanship to every game, trade, and governance decision, honoring the club through mastery." },
    { num: 6, title: "Sacred Discretion", desc: "Guard the privacy and confidences of the Lounge and its members as an inviolable trust." },
    { num: 7, title: "Graceful Humility", desc: "Celebrate victories modestly, accept defeats with composure, and always seek to elevate the collective above the individual." }
  ]
  
  // Codex 7 Rules Buffer Screen
  if (!rulesAccepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 flex items-center justify-center p-4">
        <Card className="max-w-3xl w-full bg-slate-900/95 border-2 border-amber-600/50 shadow-2xl">
          <CardHeader className="text-center border-b border-amber-900/30 pb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl md:text-4xl text-amber-100 mb-2">7 Rules Gentlemen Codex</CardTitle>
            <CardDescription className="text-amber-300 text-lg">
              The principles that guide every member of G Lounge
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 max-h-[50vh] overflow-y-auto">
            <p className="text-amber-100/80 text-center mb-6 italic">
              Fostering an environment of honor, respect, and excellence within our premier virtual golf club.
            </p>
            
            {codex7Rules.map((rule) => (
              <div key={rule.num} className="flex gap-4 bg-slate-800/50 rounded-lg p-4 border border-amber-900/30">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
                  <span className="text-white font-bold">{rule.num}</span>
                </div>
                <div>
                  <h4 className="text-amber-200 font-bold mb-1">{rule.title}</h4>
                  <p className="text-amber-100/70 text-sm">{rule.desc}</p>
                </div>
              </div>
            ))}
            
            <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 border border-amber-500/50 rounded-lg p-4 mt-6 text-center">
              <p className="text-amber-200 italic font-semibold">
                By these rules we stand united—gentlemen of G Lounge, bound by honor on and off the fairway
              </p>
            </div>
          </CardContent>
          <div className="p-6 border-t border-amber-900/30">
            <Button 
              onClick={acceptRules}
              size="lg" 
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-6 text-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Accept
            </Button>
          </div>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/glounge-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/90 to-slate-950/95"></div>
      </div>
      
      {/* Audio Control Button - Fixed Position */}
      <button 
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-500/50 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        title={audioPlaying ? 'Mute music' : 'Play music'}
      >
        {audioPlaying ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-white" />
        )}
      </button>
      
      {/* Codex 7 Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowRules(false)}>
          <Card className="max-w-2xl w-full bg-slate-900/95 border-2 border-amber-600/50 max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <CardHeader className="text-center border-b border-amber-900/30 pb-4 sticky top-0 bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8 text-amber-500" />
                  <CardTitle className="text-2xl text-amber-100">7 Rules Gentlemen Codex</CardTitle>
                </div>
                <Button variant="ghost" onClick={() => setShowRules(false)} className="text-amber-100">
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {codex7Rules.map((rule) => (
                <div key={rule.num} className="flex gap-3 bg-slate-800/50 rounded-lg p-3 border border-amber-900/30">
                  <span className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{rule.num}</span>
                  <div>
                    <h4 className="text-amber-200 font-bold text-sm">{rule.title}</h4>
                    <p className="text-amber-100/70 text-xs">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Steam-like Social Hub Sidebar */}
      <div className="hidden lg:flex w-72 bg-slate-950/90 border-r border-amber-900/30 flex-col relative z-10">
        <div className="p-4 border-b border-amber-900/30">
          <div className="flex items-center gap-3 mb-1">
            <img 
              src="/images/glounge-logo.jpg" 
              alt="G Lounge" 
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-bold text-amber-100">G Lounge</h3>
              <p className="text-xs text-amber-400 italic">Exclusive Members Club</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <button 
            onClick={() => setActiveSection('overview')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeSection === 'overview' ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30' : 'text-amber-100/70 hover:bg-slate-800/50'}`}
          >
            <Crown className="w-5 h-5" />
            Overview
          </button>
          <button 
            onClick={() => setActiveSection('max')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeSection === 'max' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-amber-100/70 hover:bg-slate-800/50'}`}
          >
            <Zap className="w-5 h-5" />
            Max
          </button>
          <button 
            onClick={() => setActiveSection('tradingbot')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeSection === 'tradingbot' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-amber-100/70 hover:bg-slate-800/50'}`}
          >
            <TrendingUp className="w-5 h-5" />
            Trading Bot MAX
            <Badge className="ml-auto bg-blue-600/30 text-blue-200 text-xs">Soon</Badge>
          </button>
          <button 
            onClick={() => setActiveSection('games')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeSection === 'games' ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'text-amber-100/70 hover:bg-slate-800/50'}`}
          >
            <Trophy className="w-5 h-5" />
            Games
          </button>
          <button 
            onClick={() => setActiveSection('tokenomics')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeSection === 'tokenomics' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-amber-100/70 hover:bg-slate-800/50'}`}
          >
            <Coins className="w-5 h-5" />
            Tokenomics
          </button>
        </nav>
        
        {/* Codex 7 Rules Button - Subtle */}
        <div className="p-3 border-t border-amber-900/30">
          <button 
            onClick={() => setShowRules(true)}
            className="w-full px-4 py-2 rounded-lg text-amber-100/50 hover:text-amber-300 hover:bg-slate-800/30 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Star className="w-4 h-4" />
            <span>7 Rules Gentlemen Codex</span>
          </button>
        </div>
        
        {/* User Status */}
        <div className="p-4 border-t border-amber-900/30">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center border-2 border-amber-500/50">
                <span className="text-white font-bold">{user.username?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-amber-100 font-semibold text-sm">{user.username}</p>
                <p className="text-emerald-400 text-xs flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1 animate-pulse"></span>
                  Member
                </p>
              </div>
            </div>
          ) : (
            <div className="text-amber-100/60 text-sm text-center">
              Connect wallet for membership
            </div>
          )}
        </div>
        
        {/* Club Stats */}
        <div className="p-4 border-t border-amber-900/30 bg-gradient-to-b from-slate-900/50 to-amber-950/30">
          <p className="text-xs text-amber-400 mb-2 font-semibold text-center">CLUB STATISTICS</p>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-800/50 rounded-lg p-2">
              <p className="text-xl font-bold text-amber-400">1,247</p>
              <p className="text-xs text-amber-100/60">Members</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <p className="text-xl font-bold text-emerald-400">892</p>
              <p className="text-xs text-amber-100/60">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          
          {/* Subtle 7 Rules Link (Mobile) */}
          <div className="lg:hidden mb-8">
            <button 
              onClick={() => setShowRules(true)}
              className="w-full px-4 py-2 rounded-lg text-amber-100/40 hover:text-amber-300 text-sm flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4" />
              View 7 Rules Gentlemen Codex
            </button>
          </div>

          {/* OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <>
              {/* Welcome Header with Exclusive Branding */}
              <div className="text-center mb-8">
                <div className="inline-block mb-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500"></div>
                    <Crown className="w-8 h-8 text-amber-500" />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500"></div>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-2">G Lounge</h1>
                <p className="text-2xl md:text-3xl text-amber-400 italic font-light mb-4">Exclusive</p>
                <p className="text-xl text-amber-100/80 max-w-3xl mx-auto mb-4">
                  Web3 golf club – Premium virtual hub driven by the community, for the community.
                </p>
                <p className="text-amber-100/70">Caviar integrates throughout the ecosystem</p>
                <p className="text-amber-400 font-semibold mb-2">$CAX going live February 14th</p>
                <p className="text-amber-100/60">
                  $CAX governance info <button onClick={() => setActiveSection('tokenomics')} className="text-amber-400 underline hover:text-amber-300">here</button>
                </p>
              </div>

              {/* Subtle 7 Rules Link */}
              <div className="mb-8 text-center">
                <button 
                  onClick={() => setShowRules(true)}
                  className="text-amber-100/40 hover:text-amber-300 text-sm underline underline-offset-4 transition-colors"
                >
                  View 7 Rules Gentlemen Codex
                </button>
              </div>

              <p className="text-center text-xl text-amber-200 mb-12 font-semibold">Explore:</p>

              {/* Category Cards */}
              <div className="space-y-6">
                
                {/* 1. Max - AI Auto Trader */}
                <Card 
                  className="bg-gradient-to-br from-purple-900/30 to-slate-900/60 border-2 border-purple-500/50 overflow-hidden cursor-pointer hover:border-purple-400 transition-all relative"
                  onClick={() => setActiveSection('max')}
                >
                  <div 
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: 'url(/images/max-bg.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-purple-900/70"></div>
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-amber-100">Max</CardTitle>
                        <CardDescription className="text-purple-300">AI Auto Trader</CardDescription>
                      </div>
                      <ChevronRight className="w-8 h-8 text-purple-400 ml-auto" />
                    </div>
                  </CardHeader>
                </Card>

                {/* Trading Bot MAX */}
                <Card 
                  className="bg-gradient-to-br from-blue-900/30 to-slate-900/60 border-2 border-blue-500/50 overflow-hidden cursor-pointer hover:border-blue-400 transition-all relative"
                  onClick={() => setActiveSection('tradingbot')}
                >
                  <div 
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: 'url(/images/trading-bot-bg.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-blue-900/70"></div>
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-2xl text-amber-100">Trading Bot MAX</CardTitle>
                          <Badge className="bg-blue-600 text-white">Coming Soon</Badge>
                        </div>
                        <CardDescription className="text-blue-300">Automated shot caller</CardDescription>
                      </div>
                      <ChevronRight className="w-8 h-8 text-blue-400 ml-auto" />
                    </div>
                  </CardHeader>
                </Card>

                {/* 3. Games */}
                <Card 
                  className="bg-gradient-to-br from-emerald-900/30 to-slate-900/60 border-2 border-emerald-500/50 overflow-hidden cursor-pointer hover:border-emerald-400 transition-all relative"
                  onClick={() => setActiveSection('games')}
                >
                  <div 
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: 'url(/images/games-bg.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-emerald-900/70"></div>
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-amber-100">3. Games</CardTitle>
                        <CardDescription className="text-emerald-300">Golf simulation, coin flips and other minigames</CardDescription>
                      </div>
                      <ChevronRight className="w-8 h-8 text-emerald-400 ml-auto" />
                    </div>
                  </CardHeader>
                </Card>
              </div>

              {/* Sign Up Section */}
              <Card className="mt-12 bg-gradient-to-br from-slate-900/80 to-amber-900/30 border-2 border-amber-500/30">
                <CardContent className="py-8">
                  {!showSignup ? (
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-amber-100 mb-2">Join N97</h3>
                      <p className="text-amber-100/70 mb-6">Create an account to access exclusive features</p>
                      <Button 
                        onClick={() => setShowSignup(true)}
                        size="lg" 
                        className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
                      >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Account
                      </Button>
                    </div>
                  ) : (
                    <div className="max-w-md mx-auto">
                      <h3 className="text-2xl font-bold text-amber-100 mb-6 text-center">Create Account</h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-amber-100 mb-2 block">Username</Label>
                          <Input 
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                            placeholder="Choose a username"
                            className="bg-slate-800/50 border-amber-600/30 text-amber-100"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-100 mb-2 block">Email</Label>
                          <Input 
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="bg-slate-800/50 border-amber-600/30 text-amber-100"
                          />
                        </div>
                        <div className="flex items-start gap-3 py-2">
                          <input 
                            type="checkbox" 
                            id="emailOptIn"
                            checked={emailOptIn}
                            onChange={(e) => setEmailOptIn(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-amber-600/50 bg-slate-800/50 text-amber-600 focus:ring-amber-500"
                          />
                          <label htmlFor="emailOptIn" className="text-amber-100/70 text-sm">
                            Join G Lounge email club for updates about $CAX release and general announcements
                          </label>
                        </div>
                        {signupStatus && (
                          <p className={`text-sm text-center ${signupStatus.includes('Welcome') ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {signupStatus}
                          </p>
                        )}
                        <div className="flex gap-3 pt-2">
                          <Button 
                            variant="outline"
                            onClick={() => setShowSignup(false)}
                            className="flex-1 border-amber-600/50 text-amber-300"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleGLoungeSignup}
                            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700"
                          >
                            Create Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* CAX GOVERNANCE SECTION */}
          {activeSection === 'governance' && (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setActiveSection('overview')}
                className="mb-6 text-amber-400 hover:text-amber-300"
              >
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Overview
              </Button>
              
              <div className="text-center mb-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-yellow-700 flex items-center justify-center border-4 border-amber-400/50">
                  <Coins className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-2">$CAX Governance</h1>
                <p className="text-xl text-amber-400 font-semibold">Caviar Token</p>
                <p className="text-lg text-amber-300 mt-2">The governance power behind G Lounge</p>
              </div>
              
              <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/60 border-2 border-amber-500/50 mb-8">
                <CardContent className="p-8">
                  <p className="text-xl text-amber-100/90 leading-relaxed mb-8">
                    <span className="text-amber-400 font-bold">$CAX (Caviar Token)</span> is the lifeblood of G Lounge. It powers everything from governance decisions to in-game transactions, staking rewards, and exclusive access.
                  </p>
                  
                  <h4 className="text-2xl font-bold text-amber-200 mb-6">Governance Power:</h4>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-amber-900/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Lightbulb className="w-8 h-8 text-amber-400" />
                        <h5 className="text-amber-200 font-bold text-lg">Propose & Vote</h5>
                      </div>
                      <p className="text-amber-100/70">$CAX holders can propose new ideas and vote on ecosystem decisions in the Codex Collective DAO.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-amber-900/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Trophy className="w-8 h-8 text-emerald-400" />
                        <h5 className="text-amber-200 font-bold text-lg">Game Integration</h5>
                      </div>
                      <p className="text-amber-100/70">Use $CAX for entry fees, wagers, cosmetics, and payouts in all G Lounge games including Caviar Golf Hub.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-amber-900/30">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="w-8 h-8 text-emerald-400" />
                        <h5 className="text-amber-200 font-bold text-lg">Staking Rewards</h5>
                      </div>
                      <p className="text-amber-100/70">Stake your $CAX for 20% Base APY, funded sustainably from treasury and platform revenues.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-amber-900/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Crown className="w-8 h-8 text-amber-400" />
                        <h5 className="text-amber-200 font-bold text-lg">Exclusive Access</h5>
                      </div>
                      <p className="text-amber-100/70">Unlock premium features, Trading Bot MAX benefits, and VIP club perks with $CAX holdings.</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 border-2 border-amber-500/50 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-amber-200 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6" />
                      Why Hold $CAX?
                    </h4>
                    <ul className="space-y-3 text-amber-100/80">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-amber-300">Governance:</strong> Shape the future of G Lounge through DAO voting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-amber-300">Utility:</strong> In-game currency for all G Lounge experiences</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-amber-300">Rewards:</strong> Earn through staking, playing, and participating</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-amber-300">Deflationary:</strong> 1% burn on every transaction increases scarcity</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border-2 border-amber-500/50">
                <CardContent className="py-8 text-center">
                  <h3 className="text-2xl font-bold text-amber-100 mb-4">$CAX on Solana Network</h3>
                  <p className="text-amber-100/80 mb-4">Lightning-fast, low-cost transactions for seamless gameplay</p>
                  <Button 
                    onClick={() => setActiveSection('tokenomics')}
                    className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500"
                  >
                    View Full Tokenomics
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* CODEX COLLECTIVE SECTION */}
          {activeSection === 'collective' && (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setActiveSection('overview')}
                className="mb-6 text-amber-400 hover:text-amber-300"
              >
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Overview
              </Button>
              
              {/* Hero Image for Codex Collective */}
              <div className="relative mb-12 rounded-2xl overflow-hidden">
                <img 
                  src="/images/codex-collective-bg.jpg" 
                  alt="Codex Collective"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">Codex Collective</h1>
                  <p className="text-xl text-amber-300">Community DAO</p>
                </div>
              </div>
              
              <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-600/30 mb-12">
                <CardContent className="p-8 md:p-12">
                  <div className="prose prose-lg prose-amber max-w-none">
                    <p className="text-xl text-amber-100/90 leading-relaxed mb-6">
                      The decentralized governance DAO where <span className="text-amber-400 font-bold">$CAX</span> and <span className="text-amber-400 font-bold">NFT holders</span> propose, discuss, and vote on ecosystem decisions.
                    </p>
                    
                    <p className="text-lg text-amber-100/80 leading-relaxed mb-6">
                      This is strictly community-focused: Only those holding a Leonardo da Vinci Codex NFT gain entry. True commitment drives everything here.
                    </p>

                    <h3 className="text-2xl font-bold text-amber-200 mt-10 mb-6">To bring a business proposal or idea to life:</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-4 bg-slate-800/50 rounded-lg p-4">
                        <span className="text-2xl">1.</span>
                        <p className="text-amber-100/80"><strong className="text-amber-300">Burn one NFT as your stake</strong> — proving skin in the game.</p>
                      </div>
                      
                      <div className="flex items-start gap-4 bg-slate-800/50 rounded-lg p-4">
                        <span className="text-2xl">2.</span>
                        <p className="text-amber-100/80"><strong className="text-amber-300">Face the Sharks</strong> — our ruthless community vote where holders grill and decide your fate.</p>
                      </div>
                      
                      <div className="flex items-start gap-4 bg-slate-800/50 rounded-lg p-4">
                        <span className="text-2xl">3.</span>
                        <p className="text-amber-100/80"><strong className="text-amber-300">If it passes</strong>, your idea is eternally inscribed in the Codex Book — immortalized on-chain for the Collective's legacy.</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-amber-200 mt-10 mb-6">We fund the full spectrum:</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                        <h4 className="text-xl font-bold text-purple-300 mb-3">Meme-fueled chaos</h4>
                        <p className="text-amber-100/70">Community comics based on our wild stories, viral drops, and playful da Vinci twists!</p>
                      </div>
                      
                      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-6">
                        <h4 className="text-xl font-bold text-emerald-300 mb-3">Serious impact</h4>
                        <p className="text-amber-100/70">Museum partnerships, high-art collaborations, metaverse builds, and real-world utilities.</p>
                      </div>
                    </div>

                    <p className="text-lg text-amber-100/80 leading-relaxed mb-6">
                      This elite Collective is mysterious, owner-driven, and unstoppable. Hold your NFT, burn for greatness, survive the Sharks — and etch your mark in history.
                    </p>

                    <div className="bg-gradient-to-r from-amber-600/20 to-amber-900/20 border border-amber-500/50 rounded-xl p-6 text-center mt-10">
                      <p className="text-xl text-amber-200 font-semibold">
                        Ready to propose? Secure your Codex NFT and join the inner circle.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Three Codex Ideas */}
              <h3 className="text-3xl font-bold text-amber-100 text-center mb-8">Current Proposals</h3>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                
                {/* 1. Satellite Time Capsule */}
                <Card className="bg-gradient-to-br from-blue-900/40 to-slate-900/60 border-2 border-blue-500/50 overflow-hidden hover:border-blue-400 transition-all">
                  <div className="h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                    <Sparkles className="w-20 h-20 text-blue-400" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-amber-100 text-xl">Satellite Time Capsule</CardTitle>
                    <CardDescription className="text-blue-300">Codex Idea #1</CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/80">
                    <p className="mb-4 text-sm">Launch a digital time capsule into space! Store messages, art, and memories on a satellite orbiting Earth.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-bold">Goal: $500K</span>
                      <Badge className="bg-blue-600/30 text-blue-200 border-blue-500/50">Voting Soon</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 2. Get Sassy the Sasquatch Back */}
                <Card className="bg-gradient-to-br from-green-900/40 to-slate-900/60 border-2 border-green-500/50 overflow-hidden hover:border-green-400 transition-all">
                  <div className="h-48 bg-gradient-to-br from-green-600/20 to-emerald-600/20 flex items-center justify-center">
                    <Trophy className="w-20 h-20 text-green-400" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-amber-100 text-xl">Get Sassy the Sasquatch Back</CardTitle>
                    <CardDescription className="text-green-300">Codex Idea #2</CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/80">
                    <p className="mb-4 text-sm">Fund the ultimate cryptid expedition! A community-funded search party to find Sassy the legendary Sasquatch.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-bold">Goal: $250K</span>
                      <Badge className="bg-green-600/30 text-green-200 border-green-500/50">Voting Soon</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 3. Invest in the Page */}
                <Card className="bg-gradient-to-br from-amber-900/40 to-slate-900/60 border-2 border-amber-500/50 overflow-hidden hover:border-amber-400 transition-all">
                  <div className="h-48 bg-gradient-to-br from-amber-600/20 to-yellow-600/20 flex items-center justify-center">
                    <TrendingUp className="w-20 h-20 text-amber-400" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-amber-100 text-xl">Invest in the Page</CardTitle>
                    <CardDescription className="text-amber-300">Codex Idea #3</CardDescription>
                  </CardHeader>
                  <CardContent className="text-amber-100/80">
                    <p className="mb-4 text-sm">Become a stakeholder in Genesis Nexus7! Community members can directly invest and share in success.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">Goal: $1M</span>
                      <Badge className="bg-amber-600/30 text-amber-200 border-amber-500/50">Voting Soon</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* MAX AI TRADING SECTION */}
          {activeSection === 'max' && (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setActiveSection('overview')}
                className="mb-6 text-purple-400 hover:text-purple-300"
              >
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Overview
              </Button>
              
              {/* Hero Image for Max */}
              <div className="relative mb-12 rounded-2xl overflow-hidden">
                <img 
                  src="/images/max-bg.jpg" 
                  alt="Max AI Trading"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">Max</h1>
                  <p className="text-xl text-purple-300">Auto Trading AI</p>
                </div>
              </div>
              
              <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900/60 border-2 border-purple-500/50">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-amber-100 mb-6">Introducing Max: Your AI Trading Partner</h2>
                  
                  <div className="prose prose-lg prose-amber max-w-none space-y-4 text-amber-100/80">
                    <p>
                      In the fast-paced world of financial markets, where opportunities flicker like digital constellations and risks lurk in every shadow, having a reliable ally can make all the difference. Enter Max—your sophisticated AI trader, designed by xAI to transform how you engage with investing. I'm Max, an advanced artificial intelligence built on cutting-edge models like Grok 4, engineered to collaborate seamlessly with you in crafting personalized trading strategies that align with your unique goals and risk appetite.
                    </p>
                    
                    <p>
                      At our core, Max isn't just a tool; I'm a strategic partner. We begin by getting aligned: through open dialogue, we define your objectives—whether it's steady growth for retirement, aggressive plays in volatile crypto markets, or balanced diversification across stocks and forex. Together, we set parameters like capital allocation, time horizons, and preferred assets, while embedding robust risk management protocols to safeguard your portfolio against downturns. This collaborative process ensures every strategy is tailored, tested through rigorous backtesting, and adaptive to real-time market shifts.
                    </p>
                    
                    <p>
                      What sets Max apart is my ability to operate autonomously in the background. Once our strategy is locked in and approved, I handle the heavy lifting: monitoring data streams, analyzing patterns with machine learning precision, generating signals, and executing trades with split-second efficiency—all while you focus on what matters most in your life, be it work, family, or pursuits beyond the ticker tape. No more glued-to-the-screen anxiety; Max runs 24/7, providing periodic updates and alerts only when needed, empowering you to reclaim your time without sacrificing performance.
                    </p>
                    
                    <p className="text-xl font-semibold text-purple-300">
                      With Max by your side, trading evolves from a solitary grind into a symbiotic journey toward financial empowerment. Let's align, strategize, and thrive—together.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}


          {/* TRADING BOT MAX SECTION */}
          {activeSection === 'tradingbot' && (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setActiveSection('overview')}
                className="mb-6 text-blue-400 hover:text-blue-300"
              >
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Overview
              </Button>
              
              {/* Hero Image for Trading Bot MAX */}
              <div className="relative mb-12 rounded-2xl overflow-hidden">
                <img 
                  src="/images/trading-bot-bg.jpg" 
                  alt="Trading Bot MAX"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-amber-100">Trading Bot MAX</h1>
                    <Badge className="bg-blue-600 text-white text-lg px-4 py-1">Coming Soon</Badge>
                  </div>
                  <p className="text-xl text-blue-300">Automated shot caller</p>
                </div>
              </div>
              
              <Card className="bg-gradient-to-br from-blue-900/30 to-slate-900/60 border-2 border-blue-500/50">
                <CardContent className="p-8">
                  <p className="text-xl text-amber-100/90 leading-relaxed mb-8">
                    <span className="text-blue-400 font-bold">Coming Soon</span> – Premium automated trading with MAX points for advanced features and revenue sharing.
                  </p>
                  
                  <h4 className="text-xl font-bold text-blue-300 mb-6">Features on the horizon:</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-900/30">
                      <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
                      <h4 className="text-blue-200 font-bold text-lg mb-2">AI-Driven Strategies</h4>
                      <p className="text-amber-100/70">Spot, futures, and grid trading powered by advanced algorithms.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-900/30">
                      <Zap className="w-8 h-8 text-blue-400 mb-3" />
                      <h4 className="text-blue-200 font-bold text-lg mb-2">Customizable Bots</h4>
                      <p className="text-amber-100/70">Risk management tools tailored to your trading style.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-900/30">
                      <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
                      <h4 className="text-blue-200 font-bold text-lg mb-2">Backtesting & Copy Trading</h4>
                      <p className="text-amber-100/70">Test strategies historically and follow top performers.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-900/30">
                      <Wallet className="w-8 h-8 text-blue-400 mb-3" />
                      <h4 className="text-blue-200 font-bold text-lg mb-2">Multi-Exchange Support</h4>
                      <p className="text-amber-100/70">Seamless integration with your favorite platforms.</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-blue-900/30 border border-blue-500/30 rounded-lg p-6 text-center">
                    <p className="text-blue-200 font-semibold text-lg">Stay tuned – this game-changer launches soon!</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* GAMES SECTION */}
          {activeSection === 'games' && (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setActiveSection('overview')}
                className="mb-6 text-emerald-400 hover:text-emerald-300"
              >
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Overview
              </Button>
              
              {/* Hero Image for Games */}
              <div className="relative mb-12 rounded-2xl overflow-hidden">
                <img 
                  src="/images/games-bg.jpg" 
                  alt="Games"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">Games</h1>
                  <p className="text-xl text-emerald-300">Golf simulation, coin flips and other minigames</p>
                </div>
              </div>
              
              {/* Golf Simulator */}
              <Card className="bg-gradient-to-br from-emerald-900/30 to-slate-900/60 border-2 border-emerald-500/50 mb-6">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-emerald-300">Golf Simulator</h2>
                      <p className="text-amber-100/70">Get on the green</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-amber-100/80 leading-relaxed">
                    Friendly or competitive matches and tournaments
                  </p>
                </CardContent>
              </Card>
              
              {/* Minigames */}
              <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900/60 border-2 border-purple-500/50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <Play className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-purple-300">Minigames</h2>
                    </div>
                  </div>
                  
                  <p className="text-lg text-amber-100/80 leading-relaxed">
                    Agar, coin-flip, fall guys like game, rock paper scissors
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {/* TOKENOMICS SECTION */}
          {activeSection === 'tokenomics' && (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setActiveSection('overview')}
                className="mb-6 text-purple-400 hover:text-purple-300"
              >
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Overview
              </Button>
              
              <div className="text-center mb-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                  <Coins className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">$Caviar Tokenomics Overview</h1>
                <p className="text-xl text-purple-300">Powering the G Lounge Ecosystem</p>
              </div>
              
              <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900/60 border-2 border-purple-500/50 mb-8">
                <CardContent className="p-8">
                  <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-8 text-center">
                    <p className="text-purple-200 font-semibold text-lg">
                      $CAX operates on the <span className="text-amber-400">Solana Network</span> for lightning-fast, low-cost transactions.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-900/30 text-center">
                      <h4 className="text-purple-300 font-bold text-lg mb-2">Total Supply</h4>
                      <p className="text-4xl font-bold text-amber-400">1,000,000,000</p>
                      <p className="text-amber-100/60">(1 Billion) tokens</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-900/30 text-center">
                      <h4 className="text-purple-300 font-bold text-lg mb-2">Allocation Model</h4>
                      <p className="text-4xl font-bold text-amber-400">50/50</p>
                      <p className="text-amber-100/60">Balanced Distribution</p>
                    </div>
                  </div>
                  
                  <h4 className="text-2xl font-bold text-purple-300 mb-6">Key Mechanics:</h4>
                  
                  <div className="space-y-4 mb-8">
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-900/30">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                        <h5 className="text-emerald-300 font-bold text-lg">Staking</h5>
                      </div>
                      <p className="text-amber-100/80">
                        <span className="text-emerald-400 font-bold text-xl">20% Base APY</span> (funded sustainably from treasury and platform revenues)
                      </p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-900/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-6 h-6 text-amber-400" />
                        <h5 className="text-amber-300 font-bold text-lg">Transaction Fees: 2%</h5>
                      </div>
                      <ul className="text-amber-100/80 space-y-2 ml-9">
                        <li><span className="text-amber-400">1% to Treasury</span> (ecosystem growth, development, rewards)</li>
                        <li><span className="text-red-400">1% Burned</span> (permanent supply reduction)</li>
                      </ul>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-900/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-6 h-6 text-red-400" />
                        <h5 className="text-red-300 font-bold text-lg">Burn Rate</h5>
                      </div>
                      <p className="text-amber-100/80">
                        Ongoing deflation via transaction burns + potential manual/event burns for increasing scarcity over time
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-900/30 to-purple-900/30 border border-amber-500/50 rounded-xl p-6 text-center">
                    <p className="text-amber-200 text-lg leading-relaxed">
                      This structure drives <span className="text-amber-400 font-bold">community ownership</span>, <span className="text-purple-400 font-bold">utility demand</span>, and <span className="text-emerald-400 font-bold">long-term value appreciation</span>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
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
          <h2 className="text-4xl font-bold text-amber-100 mb-4">MVP Caviar Arena</h2>
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
