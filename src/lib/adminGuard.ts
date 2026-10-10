import type { APIContext } from 'astro';
import { COOKIE, isAuthed } from './adminAuth';
import { getEnv } from './adminEnv';

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** Returns an error Response when the request is not allowed, or null when it is fine to continue. */
export async function guard(ctx: Pick<APIContext, 'request' | 'cookies'>, write = false): Promise<Response | null> {
  if (!(await isAuthed(ctx.cookies.get(COOKIE)?.value, getEnv('ADMIN_TOKEN')))) return json({ error: 'Please sign in again' }, 401);
  // A custom header cannot be sent by another website's form, which blocks cross-site request forgery.
  if (write && ctx.request.headers.get('x-requested-with') !== 'kna-admin') return json({ error: 'Bad request' }, 400);
  return null;
}
