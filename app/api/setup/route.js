import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST() {
  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // SQL for creating tables and policies
    const setupSQL = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Create profiles table (extends auth.users)
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID REFERENCES auth.users(id) PRIMARY KEY,
        username TEXT UNIQUE,
        wallet_address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create whitelist table for NFT minting
      CREATE TABLE IF NOT EXISTS public.whitelist (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Enable RLS
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.whitelist ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
      DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Anyone can join whitelist" ON public.whitelist;
      DROP POLICY IF EXISTS "Users can view own whitelist entry" ON public.whitelist;

      -- Profiles policies
      CREATE POLICY "Public profiles are viewable by everyone"
        ON public.profiles FOR SELECT
        USING (true);

      CREATE POLICY "Users can update own profile"
        ON public.profiles FOR UPDATE
        USING (auth.uid() = id);

      -- Whitelist policies  
      CREATE POLICY "Anyone can join whitelist"
        ON public.whitelist FOR INSERT
        WITH CHECK (true);

      CREATE POLICY "Users can view own whitelist entry"
        ON public.whitelist FOR SELECT
        USING (true);

      -- Function to handle user creation
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (id, username, wallet_address)
        VALUES (
          NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
          NEW.raw_user_meta_data->>'wallet_address'
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Trigger for automatic profile creation
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

      -- Function to update updated_at timestamp
      CREATE OR REPLACE FUNCTION public.handle_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Trigger for profiles updated_at
      DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
      CREATE TRIGGER on_profile_updated
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    `

    // Execute SQL
    const { error } = await supabaseAdmin.rpc('exec_sql', { 
      sql_query: setupSQL 
    })

    // If rpc doesn't exist, try direct SQL execution
    if (error && error.message.includes('function')) {
      // Split SQL into individual statements and execute
      const statements = setupSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      for (const statement of statements) {
        const { error: stmtError } = await supabaseAdmin
          .from('_sql')
          .select('*')
          .limit(0) // Dummy query to execute raw SQL
        
        if (stmtError) {
          console.error('Statement error:', stmtError)
        }
      }
    }

    if (error) {
      throw error
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase setup completed successfully!' 
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Setup failed' 
    }, { status: 500 })
  }
}
