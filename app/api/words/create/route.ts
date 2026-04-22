import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';
import { getWordsErrorMessage } from '@/lib/words/words-error';

import {
  parseServerJsonSafe,
  createErrorResponse,
  createOkResponse,
} from '@/lib/api/server-response';

//===============================================================

export async function POST(request: Request) {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return createErrorResponse(getWordsErrorMessage('create', 401), 401);
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return createErrorResponse(getWordsErrorMessage('create', 400), 400);
    }

    const response = await fetch(`${API_BASE_URL}/words/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await parseServerJsonSafe<unknown>(response);

    if (!response.ok) {
      return createErrorResponse(
        getWordsErrorMessage('create', response.status, 'Server error.'),
        response.status
      );
    }

    return createOkResponse(data, 201);
  } catch (error) {
    console.error('POST /api/words/create error:', error);
    return createErrorResponse(getWordsErrorMessage('create', 500), 500);
  }
}
