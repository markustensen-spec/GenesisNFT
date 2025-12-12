import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Genesis Nexus7 - Where Renaissance Meets Revolution',
  description: 'Exclusive platform featuring Leonardo da Vinci NFT Collection, G Lounge membership, and cutting-edge investments',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
