import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env?.PUBLIC_SUPABASE_URL || 
  process.env?.NEXT_PUBLIC_SUPABASE_URL || 
  import.meta.env?.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey = 
  import.meta.env?.PUBLIC_SUPABASE_ANON_KEY || 
  process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing!");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');