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

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return createErrorResponse(getWordsErrorMessage('delete', 401), 401);
    }

    const { id } = await context.params;

    if (!id) {
      return createErrorResponse('Word id is required.', 400);
    }

    const response = await fetch(`${API_BASE_URL}/words/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await parseJsonSafe<unknown>(response);

    if (!response.ok) {
      return createErrorResponse(
        getWordsErrorMessage('delete', response.status, 'Server error.'),
        response.status
      );
    }

    return createOkResponse(data);
  } catch (error) {
    console.error('DELETE /api/words/delete/[id] error:', error);
    return createErrorResponse(getWordsErrorMessage('delete', 500), 500);
  }
}
