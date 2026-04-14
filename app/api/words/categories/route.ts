import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';

//===============================================================

function createErrorResponse(message: string, status: number) {
  return Response.json({ message }, { status });
}

//===============================================================

export async function GET() {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return createErrorResponse('Unauthorized.', 401);
    }

    const response = await fetch(`${API_BASE_URL}/words/categories`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        return createErrorResponse('Unauthorized.', 401);
      }

      if (response.status === 404) {
        return createErrorResponse('Service not found.', 404);
      }

      return createErrorResponse(
        'Failed to fetch categories.',
        response.status
      );
    }

    if (!Array.isArray(data)) {
      return createErrorResponse('Invalid server response.', 500);
    }

    return Response.json(data);
  } catch (error) {
    console.error('GET /api/words/categories error:', error);
    return createErrorResponse('Server error.', 500);
  }
}
