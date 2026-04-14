import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';

//===============================================================

function createErrorResponse(message: string, status: number) {
  return Response.json({ message }, { status });
}

//===============================================================

export async function POST(request: Request) {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return createErrorResponse('Unauthorized.', 401);
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return createErrorResponse('Bad request (invalid request body).', 400);
    }

    const response = await fetch(`${API_BASE_URL}/words/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 400) {
        return createErrorResponse('Bad request (invalid request body).', 400);
      }

      if (response.status === 401) {
        return createErrorResponse('Such a word exists.', 401);
      }

      if (response.status === 404) {
        return createErrorResponse('Service not found.', 404);
      }

      return createErrorResponse('Server error.', 500);
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/words/create error:', error);
    return createErrorResponse('Server error.', 500);
  }
}
