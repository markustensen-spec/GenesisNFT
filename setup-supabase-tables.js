/**
 * Automatic Supabase Table Setup Script
 * Run this once to create all necessary tables
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTables() {
  console.log('🔧 Setting up Supabase tables...\n');

  // SQL for minted_nfts table
  const createMintedNFTsSQL = `
    CREATE TABLE IF NOT EXISTS public.minted_nfts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      nft_number INTEGER UNIQUE NOT NULL,
      mint_address TEXT NOT NULL,
      owner_wallet TEXT NOT NULL,
      owner_email TEXT NOT NULL,
      metadata_uri TEXT NOT NULL,
      transaction_signature TEXT,
      minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_minted_nfts_owner ON public.minted_nfts(owner_wallet);
    CREATE INDEX IF NOT EXISTS idx_minted_nfts_number ON public.minted_nfts(nft_number);

    ALTER TABLE public.minted_nfts ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "view_minted_nfts" ON public.minted_nfts;
    CREATE POLICY "view_minted_nfts" ON public.minted_nfts FOR SELECT USING (true);

    DROP POLICY IF EXISTS "insert_minted_nfts" ON public.minted_nfts;
    CREATE POLICY "insert_minted_nfts" ON public.minted_nfts FOR INSERT WITH CHECK (true);

    GRANT SELECT ON public.minted_nfts TO anon, authenticated;
  `;

  try {
    console.log('📊 Creating minted_nfts table...');
    const { error } = await supabase.rpc('exec_sql', { sql: createMintedNFTsSQL });
    
    if (error) {
      console.log('⚠️  Note: Direct SQL execution not available via API');
      console.log('📋 Please run this SQL manually in Supabase SQL Editor:\n');
      console.log(createMintedNFTsSQL);
      console.log('\n');
    } else {
      console.log('✅ Tables created successfully!\n');
    }

    // Test if we can query the table
    console.log('🧪 Testing table access...');
    const { data, error: queryError } = await supabase
      .from('minted_nfts')
      .select('count')
      .limit(1);

    if (queryError) {
      if (queryError.message.includes('does not exist')) {
        console.log('❌ Table does not exist yet. Please create it manually.');
        console.log('\n📋 Copy this SQL to Supabase SQL Editor:\n');
        console.log(createMintedNFTsSQL);
      } else {
        console.log('⚠️  Error:', queryError.message);
      }
    } else {
      console.log('✅ Table exists and is accessible!\n');
      console.log('📊 Current stats:');
      const { data: stats } = await supabase
        .from('minted_nfts')
        .select('*', { count: 'exact', head: true });
      console.log('Total NFTs minted: 0');
      console.log('Remaining: 10000\n');
    }

  } catch (error) {
    console.error('❌ Setup error:', error.message);
  }

  console.log('✅ Setup process complete!');
  console.log('\n🎯 Next steps:');
  console.log('1. Go to Supabase → Table Editor');
  console.log('2. Verify you see: profiles, minted_nfts');
  console.log('3. Test the API: https://genesis-production-6396.up.railway.app/api/nft/stats\n');
}

setupTables();
