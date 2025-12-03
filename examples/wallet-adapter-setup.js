/**
 * Solana Wallet Adapter Setup
 * Configure this in your _app.js or layout.js
 */

import { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

/**
 * Wallet Configuration Component
 * Wrap your app with this provider
 */
export function WalletConfig({ children }) {
  // Use mainnet-beta for production, devnet for testing
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta'
  
  // You can also use custom RPC endpoint for better performance
  // const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

/**
 * Usage in your app:
 * 
 * // In app/layout.js or pages/_app.js
 * import { WalletConfig } from './examples/wallet-adapter-setup'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <WalletConfig>
 *           {children}
 *         </WalletConfig>
 *       </body>
 *     </html>
 *   )
 * }
 */

/**
 * Environment Variables needed:
 * 
 * NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta  # or devnet for testing
 * NEXT_PUBLIC_SOLANA_RPC_URL=https://your-custom-rpc.com (optional)
 */

/**
 * Install required packages:
 * 
 * npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui \
 *   @solana/wallet-adapter-wallets @solana/web3.js @metaplex-foundation/js
 */
