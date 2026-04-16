import { NextRequest } from 'next/server';

import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';

import {
  createErrorResponse,
  createOkResponse,
  parseJsonSafe,
} from '@/lib/words/words-response';

//===============================================================

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

//===============================================================

export async function POST(_request: NextRequest, context: RouteParams) {
  const token = await getSessionCookie();

  if (!token) {
    return createErrorResponse('Unauthorized.', 401);
  }

  const { id } = await context.params;

  if (!id?.trim()) {
    return createErrorResponse('Bad request (invalid request body).', 400);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/words/add/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await parseJsonSafe<unknown>(response);

    if (!response.ok) {
      const fallbackMessage =
        data &&
        typeof data === 'object' &&
        'message' in data &&
        typeof (data as { message?: unknown }).message === 'string'
          ? (data as { message: string }).message
          : 'Failed to add word to dictionary.';

      return createErrorResponse(fallbackMessage, response.status);
    }

    return createOkResponse(data);
  } catch (error) {
    console.error('POST /api/words/add/[id] error:', error);
    return createErrorResponse('Failed to add word to dictionary.', 500);
  }
}
