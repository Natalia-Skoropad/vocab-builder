import { NextRequest } from 'next/server';

import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';

import {
  createErrorResponse,
  createOkResponse,
  isOwnWordsResponse,
  normalizeOwnWordsResponse,
  parseJsonSafe,
} from '@/lib/words/words-response';

import { getWordsErrorMessage } from '@/lib/words/words-error';

//===============================================================

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 7;

//===============================================================

export async function GET(request: NextRequest) {
  const token = await getSessionCookie();

  if (!token) {
    return createErrorResponse('Unauthorized.', 401);
  }

  const { searchParams } = new URL(request.url);

  const backendParams = new URLSearchParams();

  const keyword = searchParams.get('keyword')?.trim();
  const category = searchParams.get('category')?.trim();
  const isIrregular = searchParams.get('isIrregular');
  const page = Number(searchParams.get('page') ?? DEFAULT_PAGE);
  const limit = Number(searchParams.get('limit') ?? DEFAULT_LIMIT);

  if (keyword) {
    backendParams.set('keyword', keyword);
  }

  if (category) {
    backendParams.set('category', category);
  }

  if (isIrregular === 'true' || isIrregular === 'false') {
    backendParams.set('isIrregular', isIrregular);
  }

  backendParams.set(
    'page',
    String(Number.isInteger(page) && page > 0 ? page : DEFAULT_PAGE)
  );

  backendParams.set(
    'limit',
    String(Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_LIMIT)
  );

  const backendUrl = `${API_BASE_URL}/words/all?${backendParams.toString()}`;

  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await parseJsonSafe<unknown>(response);

    if (!response.ok) {
      return createErrorResponse(
        getWordsErrorMessage(
          'own',
          response.status,
          data &&
            typeof data === 'object' &&
            'message' in data &&
            typeof (data as { message?: unknown }).message === 'string'
            ? (data as { message: string }).message
            : undefined
        ),
        response.status
      );
    }

    if (!isOwnWordsResponse(data)) {
      return createErrorResponse('Invalid recommend words response.', 500);
    }

    return createOkResponse(
      normalizeOwnWordsResponse(
        data,
        Number.isInteger(page) && page > 0 ? page : DEFAULT_PAGE,
        Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_LIMIT
      )
    );
  } catch (error) {
    console.error('GET /api/words/recommend error:', error);
    return createErrorResponse('Failed to fetch recommended words.', 500);
  }
}
