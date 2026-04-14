import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';

//===============================================================

function createErrorResponse(message: string, status: number) {
  return Response.json({ message }, { status });
}

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
      return createErrorResponse('Unauthorized.', 401);
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => null);

    if (!id || !body || typeof body !== 'object') {
      return createErrorResponse('Bad request (invalid request body).', 400);
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

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 400) {
        return createErrorResponse('Bad request (invalid request body).', 400);
      }

      if (response.status === 401) {
        return createErrorResponse('This word not found.', 401);
      }

      if (response.status === 403) {
        return createErrorResponse(
          "You don't have right to edit this word.",
          403
        );
      }

      if (response.status === 404) {
        return createErrorResponse('Service not found.', 404);
      }

      return createErrorResponse('Server error.', 500);
    }

    return Response.json(data);
  } catch (error) {
    console.error('PATCH /api/words/edit/[id] error:', error);
    return createErrorResponse('Server error.', 500);
  }
}
