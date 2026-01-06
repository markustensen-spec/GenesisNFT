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
            <h2 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4">
              CC Genesis Whitepaper
            </h2>
            <p className="text-xl text-amber-100/80 max-w-3xl mx-auto">
              Building the future of decentralized utility - From P2E game to licensed neo-bank
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
              Caviar on Solana: Golf simulator and other minigames with integrated tokenomics going back to the community.
            </p>
            <p>
              We rocket straight into a fully licensed neo-bank — banking, investing, crypto-fiat rails — all governed and owned by the $CAX token.
            </p>
            <p>
              Bootstrapped by premium NFTs, P2E rewards, and the ultra-exclusive G Lounge for the real ones.
            </p>
            <p className="text-lg font-semibold text-amber-400">
              CC Genesis isn't just GameFi. It's the world's first player-owned, digital bank.
            </p>
            <p className="mt-6">
              On top of that, Noir97 represents the VIP Club where every member gets a personalized AI.
            </p>
            <p>
              Our first mission will be creating our very own luxurious caviar brand.
            </p>
            <p className="text-xl font-bold text-amber-300 mt-6">
              Stay tuned!
            </p>
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
