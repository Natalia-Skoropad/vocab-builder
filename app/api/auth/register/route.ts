import { API_BASE_URL } from '@/lib/constants/api';
import { setSessionCookie } from '@/lib/server/auth/session';
import { getAuthErrorMessage } from '@/lib/auth/auth-error';

import {
  buildUserFromBackendAuth,
  createErrorResponse,
  createUserResponse,
  isBackendAuthResponse,
  parseJsonSafe,
} from '@/lib/auth/auth-response';

//===============================================================

type RegisterRequestBody = {
  name?: string;
  email?: string;
  password?: string;
};

//===============================================================

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequestBody;

    const response = await fetch(`${API_BASE_URL}/users/signup`, {
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
        getAuthErrorMessage(
          'register',
          response.status,
          'Registration failed.'
        ),
        response.status
      );
    }

    if (!isBackendAuthResponse(data)) {
      return createErrorResponse('Invalid server response.', 500);
    }

    await setSessionCookie(data.token);

    return createUserResponse(buildUserFromBackendAuth(data), 201);
  } catch (error) {
    console.error('POST /api/auth/register error:', error);

    return createErrorResponse(getAuthErrorMessage('register', 500), 500);
  }
}
