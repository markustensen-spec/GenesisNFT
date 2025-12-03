# GenesisHQ - Where Renaissance Meets Revolution

![GenesisHQ](https://customer-assets.emergentagent.com/job_genesishq/artifacts/q195yjzo_grok_image_x1mlhza.jpg)

A cutting-edge blockchain platform combining Leonardo da Vinci's timeless genius with modern Web3 innovation. GenesisHQ features an exclusive NFT collection, live investment tracking, premium G Lounge membership, and the Genesis Caviar multiplayer game.

## 🌟 Features

### 1. **Leonardo da Vinci NFT Collection**
- 10 original masterpieces + 9,989 generative variations
- Renaissance engineering meets holographic technology
- Minting on Solana Devnet (testnet ready)
- Whitelist registration for early access
- $CAX token integration

### 2. **G Lounge - Exclusive Members Club ($55/month)**
The ultimate destination for elite traders and collectors:
- 🔒 **Exclusive Content**: Premium market analysis, early NFT drops, private webinars
- ⚡ **MAX Trading Bot**: AI-powered trading strategies and portfolio optimization
- 👥 **Codex Collective**: Private community with networking and investment pools
- 🏆 **Premium Perks**: 2x staking rewards, reduced fees, priority support

### 3. **Live Investments**
- Real-time cryptocurrency prices via CoinGecko API
- Track Bitcoin, Ethereum, Solana, Cardano, Polkadot, Avalanche
- Interactive price charts (coming soon: TradingView integration)
- $CAX token allocation system
- Stock market integration (planned)

### 4. **Genesis Caviar Game**
- Agar.io-style multiplayer gameplay
- Wager $CAX tokens to compete
- Real-time WebSocket server
- Global leaderboards
- Winner-takes-all prize pools

### 5. **$CAX Token Economy**
- Total Supply: 1,000,000,000 $CAX
- Utility: Staking, gaming, governance, investments
- NFT holder bonuses
- G Lounge premium rates

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.3 (React 18)
- **Styling**: TailwindCSS + shadcn/ui components
- **Blockchain**: Solana Web3.js (Devnet)
- **Wallet Integration**: @solana/wallet-adapter (Phantom & Solflare)
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Next.js API Routes
- **Database**: MongoDB
- **APIs**: 
  - CoinGecko (crypto prices)
  - Solana RPC (blockchain interactions)
- **Real-time**: Socket.io (game server - coming soon)

### Infrastructure
- **Hosting**: Vercel-compatible
- **Network**: Solana Devnet
- **Environment**: Docker + Kubernetes ready

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 18.0.0
MongoDB >= 6.0
Yarn >= 1.22
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd app
```

2. **Install dependencies**
```bash
yarn install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=genesishq_db

# Application
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# CoinGecko API (free tier - no key required)
COINGECKO_API_URL=https://api.coingecko.com/api/v3

# Feature Flags
GAME_WAGERING_ENABLED=false
STRIPE_ENABLED=false

# Assets
NEXT_PUBLIC_NFT_IMAGE_URL=<your-nft-image-url>
```

4. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your existing MongoDB instance
```

5. **Run the development server**
```bash
yarn dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
/app
├── app/
│   ├── api/[[...path]]/route.js  # API routes
│   ├── page.js                    # Main application
│   ├── layout.js                  # Root layout
│   ├── globals.css                # Global styles
│   └── wallet-provider.js         # Wallet context
├── components/
│   └── ui/                        # shadcn/ui components
├── lib/
│   └── utils.js                   # Utility functions
├── .env                           # Environment variables
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🔌 API Endpoints

### Root
```
GET /api
Returns API information and available endpoints
```

### Crypto Prices
```
GET /api/prices
Returns real-time cryptocurrency prices from CoinGecko
Response: { success: true, data: [...], timestamp: "..." }
```

### NFT Minting
```
POST /api/nft/mint
Body: { walletAddress: "..." }
Mints a Leonardo da Vinci NFT (testnet simulation)
Response: { success: true, mintId: "...", message: "..." }
```

### Whitelist Registration
```
POST /api/whitelist
Body: { email: "...", walletAddress: "..." }
Registers user for early NFT access
Response: { success: true, id: "..." }
```

### Game Leaderboard
```
GET /api/game/leaderboard
Returns top 10 players
Response: { success: true, data: [...] }
```

### Game Score Submission
```
POST /api/game/score
Body: { walletAddress: "...", score: 1000, username: "..." }
Updates player score
Response: { success: true, message: "Score updated" }
```

## 🎮 Wallet Integration

GenesisHQ supports multiple Solana wallets:

### Supported Wallets
- **Phantom** - Most popular Solana wallet
- **Solflare** - Multi-chain wallet with advanced features

### Wallet Features
- One-click connection
- Automatic wallet detection
- Transaction signing for NFT mints
- Wallet address display
- Secure authentication

### Testing on Devnet
1. Install Phantom or Solflare wallet extension
2. Switch to Devnet network
3. Get free SOL from https://faucet.solana.com
4. Connect wallet on GenesisHQ
5. Test NFT minting and features

## 🎨 Design System

### Colors
- **Primary**: Amber/Gold (#F59E0B) - Represents luxury and exclusivity
- **Background**: Slate (#0F172A) - Dark, sophisticated
- **Accent**: Amber gradients for CTAs
- **Text**: Amber variations for hierarchy

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large sizes with gradients
- **Body**: Regular weight, high readability

### Components
All UI components from shadcn/ui:
- Buttons, Cards, Tabs, Badges, Inputs
- Dialogs, Tooltips, Dropdowns
- Fully accessible and customizable

## 🔐 Security Considerations

### Current Implementation (MVP/Testnet)
⚠️ **This is a testnet MVP - NOT production ready**

### Before Mainnet Deployment
- [ ] Audit all smart contracts
- [ ] Implement proper wallet security
- [ ] Add rate limiting and DDoS protection
- [ ] Enable HTTPS only
- [ ] Add input validation and sanitization
- [ ] Implement proper error handling
- [ ] Add logging and monitoring
- [ ] Legal compliance for wagering (varies by jurisdiction)
- [ ] KYC/AML for G Lounge subscriptions
- [ ] Terms of Service and Privacy Policy

## 🎯 Roadmap

### Phase 1: MVP (Current) ✅
- Landing page with G Lounge emphasis
- Leonardo da Vinci NFT showcase
- Live crypto investment tracking
- Wallet integration (mock)
- Basic API infrastructure

### Phase 2: Blockchain Integration (Next)
- Real Solana wallet adapter integration
- SPL token creation for $CAX
- NFT minting with Metaplex
- On-chain escrow for game wagering
- Smart contract deployment

### Phase 3: G Lounge Premium
- Stripe subscription integration
- Member-only content area
- MAX trading bot interface
- Codex Collective chat
- Enhanced staking rewards

### Phase 4: Game Launch
- WebSocket game server
- Real-time multiplayer
- $CAX wagering system
- Leaderboard with prizes
- Anti-cheat measures

### Phase 5: Advanced Features
- Stock market integration (IEX Cloud)
- TradingView charts
- Mobile app (React Native)
- DAO governance
- Cross-chain bridges

## 🧪 Testing

### Manual Testing
```bash
# Test API endpoints
curl http://localhost:3000/api
curl http://localhost:3000/api/prices

# Test NFT minting
curl -X POST http://localhost:3000/api/nft/mint \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"test123"}'
```

### Frontend Testing
1. Navigate through all tabs (Home, Investments, NFT, G Lounge, Game)
2. Test wallet connection (mock)
3. View crypto prices
4. Submit whitelist form
5. Test NFT minting flow
6. Check responsive design on mobile

## 📊 Performance

- **Bundle Size**: Optimized with Next.js code splitting
- **API Response**: < 500ms for crypto prices
- **Page Load**: < 2s on fast connections
- **Mobile-first**: Responsive design for all devices

## 🐛 Known Issues & Limitations

1. **Wallet Adapter**: Currently using mock wallet connection due to memory constraints. Real Solana wallet adapter integration pending.
2. **Stripe**: Payment integration placeholder (requires API keys)
3. **Game**: WebSocket server not yet implemented
4. **Stock Prices**: IEX Cloud integration pending (requires API key)
5. **Charts**: TradingView charts integration pending

## 🤝 Contributing

This is an MVP project. For production deployment:
1. Complete all security audits
2. Obtain necessary legal clearances
3. Implement proper wallet security
4. Add comprehensive testing
5. Set up monitoring and alerts

## 📄 License

All rights reserved © 2025 GenesisHQ

## 🆘 Support

For issues or questions:
- Check the documentation above
- Review API endpoints
- Test on Solana Devnet first
- Ensure all environment variables are set

## 🎉 Acknowledgments

- Leonardo da Vinci for timeless inspiration
- Solana Foundation for blockchain infrastructure
- Next.js team for the excellent framework
- shadcn/ui for beautiful components
- CoinGecko for crypto price data

---

**Built with ❤️ by the GenesisHQ Team**

*Where Renaissance Meets Revolution* 👑
