// Reads server-side environment variables. Anything without the PUBLIC_ prefix never reaches the browser.
// Astro does not allow looking up import.meta.env by a variable name, so each variable is read explicitly.
const fromMeta: Record<string, string | undefined> = {
  ADMIN_TOKEN: import.meta.env.ADMIN_TOKEN,
  SUPABASE_SERVICE_ROLE_KEY: import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
  PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
  SUPABASE_URL: import.meta.env.SUPABASE_URL,
};

export function getEnv(name: string): string | undefined {
  const runtime = typeof process !== 'undefined' && process.env ? process.env[name] : undefined; // Netlify runtime variables
  const value = runtime || fromMeta[name]; // .env file (local dev)
  return value ? String(value) : undefined;
}
