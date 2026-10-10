import type { APIRoute } from 'astro';
import { COOKIE, COOKIE_MAX_AGE, clearFailures, isBlocked, recordFailure, sessionValue, tokenMatches } from '../../../lib/adminAuth';
import { getEnv } from '../../../lib/adminEnv';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect, clientAddress }) => {
  let ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  if (!ip) { try { ip = clientAddress; } catch { ip = 'unknown'; } }

  if (isBlocked(ip)) return redirect('/admin?error=wait', 303);

  const token = getEnv('ADMIN_TOKEN');
  const form = await request.formData();
  const typed = String(form.get('token') || '').trim();

  if (!(await tokenMatches(typed, token))) {
    recordFailure(ip);
    return redirect('/admin?error=1', 303);
  }
  clearFailures(ip);
  cookies.set(COOKIE, await sessionValue(token as string), {
    httpOnly: true,
    sameSite: 'strict',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
  return redirect('/admin', 303);
};
