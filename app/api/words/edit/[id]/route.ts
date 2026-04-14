import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';
import { getWordsErrorMessage } from '@/lib/words/words-error';

import {
  createErrorResponse,
  createOkResponse,
  parseJsonSafe,
} from '@/lib/words/words-response';

//===============================================================

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

//===============================================================

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return createErrorResponse(getWordsErrorMessage('edit', 401), 401);
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => null);

    if (!id || !body || typeof body !== 'object') {
      return createErrorResponse(getWordsErrorMessage('edit', 400), 400);
    }

    const response = await fetch(`${API_BASE_URL}/words/edit/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await parseJsonSafe<unknown>(response);

    if (!response.ok) {
      return createErrorResponse(
        getWordsErrorMessage('edit', response.status, 'Server error.'),
        response.status
      );
    }

    return createOkResponse(data);
  } catch (error) {
    console.error('PATCH /api/words/edit/[id] error:', error);
    return createErrorResponse(getWordsErrorMessage('edit', 500), 500);
  }
}
