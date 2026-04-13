import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants/api';

import {
  getAuthTokenCookie,
  clearAuthTokenCookie,
} from '@/lib/server/auth/token';

//===============================================================

export async function POST() {
  try {
    const token = await getAuthTokenCookie();

    if (token) {
      await fetch(`${API_BASE_URL}/users/signout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }).catch(() => null);
    }

    await clearAuthTokenCookie();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/auth/logout error:', error);

    return NextResponse.json(
      { message: 'Unable to sign out.' },
      { status: 500 }
    );
  }
}
