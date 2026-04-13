import { API_BASE_URL } from '@/lib/constants/api';

import {
  clearAuthTokenCookie,
  getAuthTokenCookie,
} from '@/lib/server/auth/token';

import { getAuthErrorMessage } from '@/lib/auth/auth-error';

import {
  createErrorResponse,
  createOkResponse,
} from '@/lib/auth/auth-response';

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

    return createOkResponse();
  } catch (error) {
    console.error('POST /api/auth/logout error:', error);

    return createErrorResponse(getAuthErrorMessage('logout', 500), 500);
  }
}
