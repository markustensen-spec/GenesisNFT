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
              Genesis Nexus7 is Leonardo da Vinci's genius on steroids — fused with blockchain fire.
            </p>
            <p>
              We explode onto Solana with Genesis Caviar: a brutally addictive P2E banger (agar.io on crack) that sucks in millions to reward G Lounge members.
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
            {/* Phase 1 */}
            <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border-emerald-600/30">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">1</div>
                  <div>
                    <CardTitle className="text-amber-100 text-2xl">Genesis Caviar</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">Months 1-6 | Jan-Jun 2026</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-amber-100/80">
                <p className="font-semibold text-amber-300 mb-3">&quot;Web2.5 bootstrap&quot; - Prove product-market fit</p>
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

            {/* Phase 2 */}
            <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-600/30">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">2</div>
                  <div>
                    <CardTitle className="text-amber-100 text-2xl">Genesis NEXUS</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">Months 7-18 | Jul 2026 - Jun 2027</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-amber-100/80">
                <p className="font-semibold text-amber-300 mb-3">&quot;Now we get serious&quot; - Become a real licensed entity</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-amber-100 mb-2">Technical Track:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>✓ Full mobile app (iOS + Android)</li>
                      <li>✓ Wall golf game creation</li>
                      <li>✓ Fiat on/off-ramps</li>
                      <li>✓ MAX trading bot (alpha)</li>
                      <li>✓ Investment creators platform</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-100 mb-2">Compliance Track:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>✓ VARA full VASP license</li>
                      <li>✓ DFSA innovation license</li>
                      <li>✓ CBUAE Stored Value Facility</li>
                      <li>✓ PCI-DSS, SOC 2, ISO 27001</li>
                      <li>✓ Establish legal entity in Dubai</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-900/20">
                  <p className="font-semibold text-amber-300">End of Month 18: Fully licensed financial institution in UAE</p>
                  <p className="text-sm mt-2">Real AED accounts, debit cards, trading bot live, G Lounge subscriptions active</p>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 border-purple-600/30">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">3</div>
                  <div>
                    <CardTitle className="text-amber-100 text-2xl">Genesis Nexus7 Bank</CardTitle>
                    <CardDescription className="text-amber-100/60 text-base">2028+</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-amber-100/80">
                <p className="font-semibold text-amber-300 mb-3">&quot;We are now a bank&quot; - Global expansion</p>
                <ul className="space-y-2">
                  <li>✓ Open NUF office in Norway (tax optimization + EU passporting)</li>
                  <li>✓ Hire human account managers for high-net-worth clients</li>
                  <li>✓ Launch AI financial co-pilot integrated with MAX (24/7 real-time)</li>
                  <li>✓ Codex Collective live on mainnet - community-funded projects</li>
                  <li>✓ Investment HUB ecosystem with full social features</li>
                  <li>✓ Global debit cards, multi-currency IBANs</li>
                  <li>✓ Physical Genesis House locations (Dubai → Norway → Miami)</li>
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

        {/* Angel Deals */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-amber-100 text-center mb-8">Angel Investment Opportunities</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/50 border-amber-900/30 hover:border-amber-600/50 transition-all">
              <CardHeader>
                <CardTitle className="text-amber-100 text-2xl">Tier 1</CardTitle>
                <CardDescription className="text-amber-400 text-xl font-bold">€100,000</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-amber-500 mb-4">7% Equity</p>
                <p className="text-amber-100/70">Early supporter stake in Genesis Nexus7 with significant equity position</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-600/50 hover:border-amber-600 transition-all">
              <CardHeader>
                <CardTitle className="text-amber-100 text-2xl">Tier 2</CardTitle>
                <CardDescription className="text-amber-400 text-xl font-bold">€500,000</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-amber-400 mb-4">20% Equity</p>
                <p className="text-amber-100/70">Major stakeholder position with substantial influence</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border-purple-600/50 hover:border-purple-500 transition-all">
              <CardHeader>
                <CardTitle className="text-amber-100 text-2xl">Tier 3 &quot;Genesis Syndicate&quot;</CardTitle>
                <CardDescription className="text-purple-400 text-xl font-bold">€1,000,000</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-purple-400 mb-4">35% Equity</p>
                <p className="text-amber-100/70">Founding partner with controlling interest and strategic input</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Founder */}
        <Card className="bg-gradient-to-r from-slate-900/80 to-slate-900/50 border-amber-600/30 mb-8">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-100 mb-4">The Founder</h3>
              <p className="text-xl text-amber-300 font-semibold mb-2">Markus Stensen</p>
              <p className="text-amber-100/70 mb-4">Norwegian | 97&apos; | Ex-TikTok & Disney+</p>
              <p className="text-amber-100/80 max-w-2xl mx-auto mb-6">
                &quot;If the vision hits you the same way it hits me, let&apos;s talk numbers that work for both of us. Counter-offer, ask questions, propose a different structure — I read and answer everything myself.&quot;
              </p>
              <p className="text-sm text-amber-100/60 italic">
                The longship is in the water, sails are up, and the wind is perfect. There&apos;s still room in the front rows for the right people.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact for Investment */}
        <Card className="bg-gradient-to-r from-amber-600/20 to-amber-900/20 border-amber-600/50">
          <CardContent className="py-12 text-center">
            <h3 className="text-3xl font-bold text-amber-100 mb-6">Investment Inquiries</h3>
            <p className="text-xl text-amber-100/80 mb-6">
              Interested in joining the Genesis journey?
            </p>
            <div className="space-y-3">
              <p className="text-lg">
                <span className="text-amber-100/60">Email:</span>{' '}
                <a href="mailto:MarkuStensen@gmail.com" className="text-amber-400 hover:text-amber-300 font-semibold underline">
                  MarkuStensen@gmail.com
                </a>
              </p>
              <p className="text-sm text-amber-100/60">Also available via Telegram: @Catqat Markus</p>
            </div>
            <div className="mt-8">
              <Button 
                onClick={() => window.open('https://customer-assets.emergentagent.com/job_genesishq/artifacts/3ry0vxfv_Genesis Nexus7%20%E2%80%93%20WHITEPAPER%2C%20RM%20%26%20ANGEL%20DEALS.docx.pdf', '_blank')}
                size="lg" 
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Download Full Whitepaper
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
