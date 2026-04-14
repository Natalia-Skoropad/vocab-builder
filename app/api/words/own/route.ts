import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';

//===============================================================

function createErrorResponse(message: string, status: number) {
  return Response.json({ message }, { status });
}

//===============================================================

type BackendOwnWordsResponse = {
  results?: unknown;
  totalPages?: unknown;
  page?: unknown;
  perPage?: unknown;
};

//===============================================================

export async function GET(request: Request) {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return createErrorResponse('Unauthorized.', 401);
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

    const data = (await response
      .json()
      .catch(() => null)) as BackendOwnWordsResponse | null;

    console.log('WORDS OWN RAW DATA:', data);

    if (!response.ok) {
      if (response.status === 401) {
        return createErrorResponse('Unauthorized.', 401);
      }

      if (response.status === 404) {
        return createErrorResponse('Service not found.', 404);
      }

      return createErrorResponse(
        'Failed to fetch user words.',
        response.status
      );
    }

    if (!data || !Array.isArray(data.results)) {
      return createErrorResponse('Invalid server response.', 500);
    }

    const normalizedPage =
      typeof data.page === 'number' ? data.page : Number(page) || 1;

    const normalizedPerPage =
      typeof data.perPage === 'number' ? data.perPage : Number(limit) || 7;

    const normalizedTotalPages =
      typeof data.totalPages === 'number' ? data.totalPages : 1;

    return Response.json({
      results: data.results,
      totalPages: normalizedTotalPages,
      page: normalizedPage,
      perPage: normalizedPerPage,
    });
  } catch (error) {
    console.error('GET /api/words/own error:', error);
    return createErrorResponse('Server error.', 500);
  }
}
