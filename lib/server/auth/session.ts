import 'server-only';

import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/lib/constants/api';

//===============================================================

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

//===============================================================

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    ...baseCookieOptions,
    maxAge: SESSION_MAX_AGE,
  });
}

//===============================================================

export async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

//===============================================================

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    ...baseCookieOptions,
    maxAge: 0,
  });
}
