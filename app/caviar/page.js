'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Calendar, Coins, Users, TrendingUp, Shield } from 'lucide-react'

export default function CaviarPage() {
  // Tokenomics data for pie chart
  const tokenomics = [
    { label: 'Community & Rewards', percentage: 40, color: '#f59e0b' },
    { label: 'Development & Treasury', percentage: 25, color: '#8b5cf6' },
    { label: 'Liquidity Pool', percentage: 20, color: '#10b981' },
    { label: 'Team (Vested)', percentage: 15, color: '#3b82f6' },
  ]

  // Calculate pie chart segments
  const createPieChart = () => {
    let cumulativePercentage = 0
    return tokenomics.map((item, index) => {
      const startAngle = cumulativePercentage * 3.6
      cumulativePercentage += item.percentage
      const endAngle = cumulativePercentage * 3.6
      
      const startRad = (startAngle - 90) * (Math.PI / 180)
      const endRad = (endAngle - 90) * (Math.PI / 180)
      
      const x1 = 100 + 80 * Math.cos(startRad)
      const y1 = 100 + 80 * Math.sin(startRad)
      const x2 = 100 + 80 * Math.cos(endRad)
      const y2 = 100 + 80 * Math.sin(endRad)
      
      const largeArc = item.percentage > 50 ? 1 : 0
      
      return (
        <path
          key={index}
          d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={item.color}
          stroke="#1e293b"
          strokeWidth="2"
        />
      )
    })
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/images/caviar-tokenomics-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/85 to-slate-950/95"></div>
      
      <div className="relative z-10">
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
                Back
              </Button>
              <h1 className="text-2xl font-bold text-amber-100">Caviar Governance</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Launch Banner */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 mb-12 text-center shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-white" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">$CAX Goes Live</h2>
            </div>
            <p className="text-5xl md:text-7xl font-bold text-white mb-4">February 14th</p>
            <p className="text-xl text-amber-100">Valentine&apos;s Day 2025 🚀</p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Pie Chart */}
            <Card className="bg-slate-900/80 border-amber-500/30 backdrop-blur-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-amber-100 mb-6 text-center">Token Distribution</h3>
                
                <div className="flex justify-center mb-8">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    {createPieChart()}
                    <circle cx="100" cy="100" r="40" fill="#0f172a" />
                    <text x="100" y="95" textAnchor="middle" className="fill-amber-400 text-lg font-bold">$CAX</text>
                    <text x="100" y="115" textAnchor="middle" className="fill-amber-100 text-xs">1B Total</text>
                  </svg>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                  {tokenomics.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-amber-100">{item.label}</span>
                      </div>
                      <span className="text-amber-400 font-bold">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Token Stats */}
            <div className="space-y-6">
              <Card className="bg-slate-900/80 border-amber-500/30 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                      <p className="text-3xl font-bold text-amber-400">1B</p>
                      <p className="text-amber-100/60 text-sm">Total Supply</p>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                      <p className="text-3xl font-bold text-amber-400">20%</p>
                      <p className="text-amber-100/60 text-sm">Base APY</p>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                      <p className="text-3xl font-bold text-amber-400">2x</p>
                      <p className="text-amber-100/60 text-sm">NFT Holder Boost</p>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                      <p className="text-3xl font-bold text-amber-400">1%</p>
                      <p className="text-amber-100/60 text-sm">Burn Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-amber-500/30 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold text-amber-100 mb-4">$CAX Utility</h4>
                  <ul className="space-y-3 text-amber-100/80">
                    <li className="flex items-start gap-2">
                      <Users className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Governance voting on G Lounge proposals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Staking rewards up to 40% APY for NFT holders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Coins className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>In-game currency for all G Lounge games</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Priority access to Codex Collective launches</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom CTA */}
          <Card className="bg-gradient-to-r from-amber-900/50 to-slate-900/80 border-amber-500/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-amber-100 mb-4">Join the Caviar Community</h3>
              <p className="text-amber-100/70 mb-6 max-w-2xl mx-auto">
                Be part of the governance revolution. Hold $CAX, stake your tokens, and help shape the future of the Genesis ecosystem.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
                >
                  Back to Home
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/?tab=game'}
                  className="border-amber-500/50 text-amber-100 hover:bg-amber-600/20"
                >
                  Enter G Lounge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
