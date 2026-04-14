import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';
import { getWordsErrorMessage } from '@/lib/words/words-error';
import {
  createErrorResponse,
  createOkResponse,
  isOwnWordsResponse,
  normalizeOwnWordsResponse,
  parseJsonSafe,
} from '@/lib/words/words-response';

//===============================================================

export async function GET(request: Request) {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return createErrorResponse(getWordsErrorMessage('own', 401), 401);
    }

    const { searchParams } = new URL(request.url);
    const backendParams = new URLSearchParams();

    const keyword = searchParams.get('keyword')?.trim();
    const category = searchParams.get('category')?.trim();
    const isIrregular = searchParams.get('isIrregular')?.trim();
    const page = searchParams.get('page')?.trim();
    const limit = searchParams.get('limit')?.trim();

    if (keyword) backendParams.set('keyword', keyword);
    if (category && category !== 'categories') {
      backendParams.set('category', category);
    }
    if (isIrregular === 'true' || isIrregular === 'false') {
      backendParams.set('isIrregular', isIrregular);
    }
    if (page) backendParams.set('page', page);
    if (limit) backendParams.set('limit', limit);

    const query = backendParams.toString();
    const url = `${API_BASE_URL}/words/own${query ? `?${query}` : ''}`;

    const response = await fetch(url, {
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
          'Failed to fetch user words.'
        ),
        response.status
      );
    }

    if (!isOwnWordsResponse(data)) {
      return createErrorResponse('Invalid server response.', 500);
    }

    const normalized = normalizeOwnWordsResponse(
      data,
      Number(page) || 1,
      Number(limit) || 7
    );

    return createOkResponse(normalized);
  } catch (error) {
    console.error('GET /api/words/own error:', error);
    return createErrorResponse(getWordsErrorMessage('own', 500), 500);
  }
}
