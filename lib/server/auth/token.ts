import 'server-only';

import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/constants/api';

//===============================================================

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

//===============================================================

export async function setAuthTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    ...baseCookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
}

//===============================================================

export async function getAuthTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

//===============================================================

export async function clearAuthTokenCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    ...baseCookieOptions,
    maxAge: 0,
  });
}
