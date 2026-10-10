// Shared-token protection for /admin. There is no Supabase auth: the ADMIN_TOKEN in .env is the only gate.
// Pure functions (no Astro / env access) so they can be tested on their own.

export const COOKIE = 'kna_admin';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // stay signed in on the owner's phone for 30 days

const enc = new TextEncoder();

async function hmacHex(key: string, message: string): Promise<string> {
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

/** Value stored in the session cookie. Derived from the token, so changing ADMIN_TOKEN signs everyone out. */
export const sessionValue = (token: string) => hmacHex(token, 'kitchenandall-admin-session-v1');

/** Does what the owner typed match ADMIN_TOKEN? (Compares hashes so length does not leak.) */
export async function tokenMatches(input: string, token?: string): Promise<boolean> {
  if (!token || !input) return false;
  return safeEqual(await hmacHex(token, 'login-check'), await hmacHex(input, 'login-check'));
}

/** Is this cookie a valid session? With no ADMIN_TOKEN configured, nobody is ever signed in. */
export async function isAuthed(cookie: string | undefined, token: string | undefined): Promise<boolean> {
  if (!token || !cookie) return false;
  return safeEqual(cookie, await sessionValue(token));
}

// ---- brute-force protection: 8 wrong tries per 10 minutes per address (in memory; resets on a cold start) ----
const fails = new Map<string, { n: number; reset: number }>();
const MAX_FAILS = 8;
const WINDOW_MS = 10 * 60 * 1000;

export function isBlocked(key: string, now = Date.now()): boolean {
  const f = fails.get(key);
  if (!f) return false;
  if (now > f.reset) { fails.delete(key); return false; }
  return f.n >= MAX_FAILS;
}
export function recordFailure(key: string, now = Date.now()): void {
  const f = fails.get(key);
  if (!f || now > f.reset) fails.set(key, { n: 1, reset: now + WINDOW_MS });
  else f.n++;
}
export const clearFailures = (key: string) => { fails.delete(key); };
