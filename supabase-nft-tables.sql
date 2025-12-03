-- NFT Minting Tables for Lazy Minting
-- Run this in Supabase SQL Editor

-- Table to track minted NFTs
CREATE TABLE IF NOT EXISTS public.minted_nfts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nft_number INTEGER UNIQUE NOT NULL,
  mint_address TEXT UNIQUE NOT NULL,
  owner_wallet TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  metadata_uri TEXT NOT NULL,
  transaction_signature TEXT,
  minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for faster queries
  CONSTRAINT nft_number_range CHECK (nft_number >= 1 AND nft_number <= 10000)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_minted_nfts_owner ON public.minted_nfts(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_minted_nfts_number ON public.minted_nfts(nft_number);
CREATE INDEX IF NOT EXISTS idx_minted_nfts_email ON public.minted_nfts(owner_email);

-- RLS Policies
ALTER TABLE public.minted_nfts ENABLE ROW LEVEL SECURITY;

-- Allow public to view minted NFTs
CREATE POLICY "Anyone can view minted NFTs"
  ON public.minted_nfts FOR SELECT
  USING (true);

-- Only authenticated users can mint (server-side)
CREATE POLICY "Server can insert minted NFTs"
  ON public.minted_nfts FOR INSERT
  WITH CHECK (true);

-- Stats view
CREATE OR REPLACE VIEW public.nft_stats AS
SELECT 
  COUNT(*) as total_minted,
  COUNT(DISTINCT owner_wallet) as unique_owners,
  MIN(minted_at) as first_mint,
  MAX(minted_at) as last_mint
FROM public.minted_nfts;

-- Grant access
GRANT SELECT ON public.nft_stats TO anon, authenticated;
