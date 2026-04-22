import { API_BASE_URL } from '@/lib/constants/api';

import {
  clearSessionCookie,
  getSessionCookie,
} from '@/lib/server/auth/session';

import { getAuthErrorMessage } from '@/lib/auth/auth-error';
import { createAuthOkResponse } from '@/lib/auth/auth-response';
import { createErrorResponse } from '@/lib/api/server-response';

//===============================================================

export async function POST() {
  try {
    const token = await getSessionCookie();

    if (token) {
      await fetch(`${API_BASE_URL}/users/signout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }).catch(() => null);
    }

    await clearSessionCookie();

    return createAuthOkResponse();
  } catch (error) {
    console.error('POST /api/auth/logout error:', error);

    return createErrorResponse(getAuthErrorMessage('logout', 500), 500);
  }
}
