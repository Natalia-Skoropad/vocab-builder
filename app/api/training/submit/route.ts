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

type SubmitResponseItem = {
  _id: string;
  en: string;
  ua: string;
  task: 'en' | 'ua';
  isDone: boolean;
};

type BackendErrorResponse = {
  message?: string;
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

function isValidSubmitResponseItem(item: unknown): item is SubmitResponseItem {
  return (
    !!item &&
    typeof item === 'object' &&
    typeof (item as SubmitResponseItem)._id === 'string' &&
    typeof (item as SubmitResponseItem).en === 'string' &&
    typeof (item as SubmitResponseItem).ua === 'string' &&
    ((item as SubmitResponseItem).task === 'en' ||
      (item as SubmitResponseItem).task === 'ua') &&
    typeof (item as SubmitResponseItem).isDone === 'boolean'
  );
}

function getBackendMessage(data: unknown): string | undefined {
  if (
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof (data as BackendErrorResponse).message === 'string'
  ) {
    return (data as BackendErrorResponse).message;
  }

  return undefined;
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

    const data = await parseJsonSafe<
      SubmitResponseItem[] | BackendErrorResponse
    >(response);

    if (!response.ok) {
      if (response.status === 400) {
        return createErrorResponse('Bad request (invalid request body).', 400);
      }

      if (response.status === 404) {
        return createErrorResponse('Service not found.', 404);
      }

      return createErrorResponse(
        getBackendMessage(data) || 'Failed to save training answers.',
        response.status || 500
      );
    }

    if (!Array.isArray(data) || !data.every(isValidSubmitResponseItem)) {
      return createErrorResponse('Invalid training submit response.', 500);
    }

    return createOkResponse(data);
  } catch (error) {
    console.error('POST /api/training/submit error:', error);
    return createErrorResponse('Server error.', 500);
  }
}
