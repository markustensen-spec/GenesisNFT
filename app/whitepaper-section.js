import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, TrendingUp, Trophy, BookOpen } from 'lucide-react'

export default function WhitepaperSection() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero with Background */}
        <div 
          className="relative mb-16 rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `url('https://customer-assets.emergentagent.com/job_genesishq/artifacts/ndy17uf2_file_0000000069a4724696e7f1a07b4a6694.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950"></div>
          <div className="relative text-center py-20 px-4">
            <Badge className="mb-4 bg-amber-600/20 text-amber-400 border-amber-600/30 px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2 inline" />
              Full MVP Roadmap 2026 → 2028
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4">
              Genesis Nexus7 Whitepaper
            </h2>
            <p className="text-xl text-amber-100/80 max-w-3xl mx-auto">
              Building the future of decentralized finance - From viral P2E game to licensed neo-bank
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="bg-slate-900/50 border-amber-900/30 mb-8">
          <CardHeader>
            <CardTitle className="text-amber-100 text-3xl">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-100/80 space-y-4">
            <p className="text-lg">
              Genesis version of a Leonardo Da Vinci's genius in the Codex fused with blockchain fire.
            </p>
            <p>
              Solana with Genesis Caviar: a brutally addictive P2E banger (agar.io on crack) that sucks in millions to reward G Lounge members.
            </p>
            <p>
              From there we rocket straight into a fully licensed neo-bank — banking, investing, crypto-fiat rails — all governed and owned by the $CAX token.
            </p>
            <p>
              Bootstrapped by premium NFTs, P2E rewards, and the ultra-exclusive G Lounge for the real ones.
            </p>
            <p className="text-lg font-semibold text-amber-400">
              Genesis Nexus7 isn't GameFi. It's the world's first player-owned, regulated digital bank.
            </p>
            <p className="text-xl font-bold text-amber-300">
              Play → Earn → Own → Get Rich.
            </p>
          </CardContent>
        </Card>

        {/* Three Phases */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-amber-100 text-center mb-8">The Three Phases</h3>
          <div className="space-y-6">
            {/* Phase 1 - Genesis */}
            <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border-emerald-600/30">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">1</div>
                  <div>
                    <CardTitle className="text-amber-100 text-2xl">Genesis</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">Months 1-6 | Jan-Jun 2026</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-amber-100/80">
                <p className="font-semibold text-amber-300 mb-3">"Web2.5 bootstrap" - Prove product-market fit</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-amber-100 mb-2">Deliverables:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>✓ $CAX token on Solana (1B supply)</li>
                      <li>✓ Fully playable Arena game (browser + mobile)</li>
                      <li>✓ 10,000 Leonardo da Vinci NFTs</li>
                      <li>✓ Community growth (Discord, Twitter)</li>
                      <li>✓ G Lounge early bird subscriptions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-100 mb-2">Tokenomics:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• 50% to Codex Collective</li>
                      <li>• 30% liquidity</li>
                      <li>• 20% Growth Jar</li>
                      <li>• 20% APY base staking</li>
                      <li>• +10% with NFT, +10% for 6mo lock</li>
                      <li>• 1% trading fee burnt</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-900/20">
                  <p className="text-sm"><strong>Investment needed:</strong> €100,000 → Total phase cost: $350K-$500K</p>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2 - Nexus */}
            <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-600/30">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">2</div>
                  <div>
                    <CardTitle className="text-amber-100 text-2xl">Nexus</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">Months 7-18 | Jul 2026 - Jun 2027</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-amber-100/80">
                <p className="font-semibold text-amber-300 mb-3">"Now we get serious" - Become a real licensed entity</p>
                <div className="mb-4">
                  <p className="text-lg font-semibold text-amber-400 mb-2">✓ VARA full VASP license</p>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-900/20">
                  <p className="font-semibold text-amber-300">End of Month 18: Fully licensed financial institution in UAE</p>
                  <p className="text-sm mt-2">Real AED accounts, debit cards, trading bot live, G Lounge subscriptions active</p>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 - Noir9 */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 border-purple-600/30">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">3</div>
                  <div>
                    <CardTitle className="text-amber-100 text-2xl">Noir9</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">2028+</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-amber-100/80">
                <p className="font-semibold text-amber-300 mb-3">"We are now a bank" - Global expansion</p>
                <ul className="space-y-2">
                  <li>✓ Hire human account managers for high-net-worth clients</li>
                  <li>✓ Launch AI financial co-pilot integrated with MAX (24/7 real-time)</li>
                  <li>✓ Codex Collective live on mainnet - community-funded projects</li>
                  <li>✓ Investment HUB ecosystem with full social features</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Endgame Vision */}
        <Card className="bg-gradient-to-r from-amber-600/20 to-amber-900/20 border-amber-600/50 mb-8">
          <CardContent className="py-12">
            <h3 className="text-3xl font-bold text-amber-100 text-center mb-6">Endgame Vision (2028+)</h3>
            <p className="text-center text-xl text-amber-100/80 mb-8 max-w-3xl mx-auto">
              A licensed neo-bank serving millions worldwide, combining traditional banking with Web3 innovation
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Crown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h4 className="font-bold text-amber-100 mb-2">G Lounge ($55/mo)</h4>
                <p className="text-sm text-amber-100/70">Premium access to Codex Collective, MAX trading bot, account managers, and governance rights</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h4 className="font-bold text-amber-100 mb-2">Full Banking</h4>
                <p className="text-sm text-amber-100/70">Multi-currency accounts, debit cards, fiat on/off-ramps, investment opportunities</p>
              </div>
              <div className="text-center">
                <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h4 className="font-bold text-amber-100 mb-2">P2E Ecosystem</h4>
                <p className="text-sm text-amber-100/70">Arena game + Wall golf with $CAX wagering, leaderboards, and tournaments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gradient-to-r from-amber-600/20 to-amber-900/20 border-amber-600/50">
          <CardContent className="py-12 text-center">
            <h3 className="text-3xl font-bold text-amber-100 mb-6">Get In Touch</h3>
            <p className="text-xl text-amber-100/80 mb-6">
              Interested in joining the Genesis journey?
            </p>
            <div className="space-y-3">
              <p className="text-lg">
                <span className="text-amber-100/60">Telegram:</span>{' '}
                <a href="https://t.me/GMax69" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 font-semibold">
                  @GMax69
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
