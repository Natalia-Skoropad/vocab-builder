import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';
import { getWordsErrorMessage } from '@/lib/words/words-error';

import {
  parseServerJsonSafe,
  createErrorResponse,
  createOkResponse,
} from '@/lib/api/server-response';

//===============================================================

export async function GET() {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return createErrorResponse(getWordsErrorMessage('categories', 401), 401);
    }

    const response = await fetch(`${API_BASE_URL}/words/categories`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await parseServerJsonSafe<unknown>(response);

    if (!response.ok) {
      return createErrorResponse(
        getWordsErrorMessage(
          'categories',
          response.status,
          'Failed to fetch categories.'
        ),
        response.status
      );
    }

    if (!Array.isArray(data)) {
      return createErrorResponse('Invalid server response.', 500);
    }

    return createOkResponse(data);
  } catch (error) {
    console.error('GET /api/words/categories error:', error);
    return createErrorResponse(getWordsErrorMessage('categories', 500), 500);
  }
}
