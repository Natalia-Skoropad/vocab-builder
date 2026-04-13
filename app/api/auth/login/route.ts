import { API_BASE_URL } from '@/lib/constants/api';
import { setAuthTokenCookie } from '@/lib/server/auth/token';
import { getAuthErrorMessage } from '@/lib/auth/auth-error';

import {
  buildUserFromBackendAuth,
  createErrorResponse,
  createUserResponse,
  isBackendAuthResponse,
  parseJsonSafe,
} from '@/lib/auth/auth-response';

//===============================================================

type LoginRequestBody = {
  email?: string;
  password?: string;
};

//===============================================================

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequestBody;

    const response = await fetch(`${API_BASE_URL}/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await parseJsonSafe<unknown>(response);

    if (!response.ok) {
      return createErrorResponse(
        getAuthErrorMessage('login', response.status, 'Login failed.'),
        response.status
      );
    }

    if (!isBackendAuthResponse(data)) {
      return createErrorResponse('Invalid server response.', 500);
    }

    await setAuthTokenCookie(data.token);

    return createUserResponse(buildUserFromBackendAuth(data));
  } catch (error) {
    console.error('POST /api/auth/login error:', error);

    return createErrorResponse(getAuthErrorMessage('login', 500), 500);
  }
}
