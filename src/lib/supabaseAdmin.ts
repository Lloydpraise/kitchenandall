// Server-only Supabase client for /admin. Uses the service role key, so it must never be imported by a browser component.
import { createClient } from '@supabase/supabase-js';
import { getEnv } from './adminEnv';

let client: ReturnType<typeof createClient> | null = null;

export function supabaseAdmin() {
  if (client) return client;
  const url = getEnv('PUBLIC_SUPABASE_URL') || getEnv('SUPABASE_URL');
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Set SUPABASE_SERVICE_ROLE_KEY (and your Supabase URL) in .env to use /admin');
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
