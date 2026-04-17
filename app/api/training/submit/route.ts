import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';

import {
  createErrorResponse,
  createOkResponse,
  parseJsonSafe,
} from '@/lib/api/http-response';

//===============================================================

type SubmitBodyItem = {
  _id: string;
  en: string;
  ua: string;
  task: 'en' | 'ua';
};

//===============================================================

function isValidSubmitItem(item: unknown): item is SubmitBodyItem {
  return (
    !!item &&
    typeof item === 'object' &&
    typeof (item as SubmitBodyItem)._id === 'string' &&
    typeof (item as SubmitBodyItem).en === 'string' &&
    typeof (item as SubmitBodyItem).ua === 'string' &&
    ((item as SubmitBodyItem).task === 'en' ||
      (item as SubmitBodyItem).task === 'ua')
  );
}

//===============================================================

export async function POST(request: Request) {
  const token = await getSessionCookie();

  if (!token) {
    return createErrorResponse('Unauthorized.', 401);
  }

  try {
    const body = (await request.json().catch(() => null)) as unknown;

    if (!Array.isArray(body) || !body.every(isValidSubmitItem)) {
      return createErrorResponse('Bad request (invalid request body).', 400);
    }

    const response = await fetch(`${API_BASE_URL}/words/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await parseJsonSafe<unknown[] | { message?: string }>(
      response
    );

    if (!response.ok) {
      if (response.status === 400) {
        return createErrorResponse('Bad request (invalid request body).', 400);
      }

      if (response.status === 404) {
        return createErrorResponse('Service not found.', 404);
      }

      return createErrorResponse(
        data &&
          typeof data === 'object' &&
          'message' in data &&
          typeof data.message === 'string'
          ? data.message
          : 'Failed to save training answers.',
        response.status || 500
      );
    }

    if (!Array.isArray(data)) {
      return createErrorResponse('Invalid training submit response.', 500);
    }

    return createOkResponse(data);
  } catch {
    return createErrorResponse('Server error.', 500);
  }
}
