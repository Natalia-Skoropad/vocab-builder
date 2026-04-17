import { API_BASE_URL } from '@/lib/constants/api';

import {
  clearSessionCookie,
  getSessionCookie,
} from '@/lib/server/auth/session';

import { getAuthErrorMessage } from '@/lib/auth/auth-error';

import {
  buildUserFromBackendCurrent,
  createUserResponse,
  isBackendCurrentUserResponse,
} from '@/lib/auth/auth-response';

import { createErrorResponse, parseJsonSafe } from '@/lib/api/http-response';

//===============================================================

export async function GET() {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return createErrorResponse(getAuthErrorMessage('me', 401), 401);
    }

    const response = await fetch(`${API_BASE_URL}/users/current`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (response.status === 401) {
      await clearSessionCookie();
      return createErrorResponse(getAuthErrorMessage('me', 401), 401);
    }

    if (!response.ok) {
      return createErrorResponse(
        getAuthErrorMessage(
          'me',
          response.status,
          'Unable to get current user.'
        ),
        response.status
      );
    }

    const data = await parseJsonSafe<unknown>(response);

    if (!isBackendCurrentUserResponse(data)) {
      return createErrorResponse('Invalid server response.', 500);
    }

    return createUserResponse(buildUserFromBackendCurrent(data));
  } catch (error) {
    console.error('GET /api/auth/me error:', error);

    return createErrorResponse(getAuthErrorMessage('me', 500), 500);
  }
}
