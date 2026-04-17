import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';

import {
  createErrorResponse,
  createOkResponse,
  parseJsonSafe,
} from '@/lib/api/http-response';

//===============================================================

type BackendTasksResponse = {
  tasks: unknown[];
};

function isBackendTasksResponse(data: unknown): data is BackendTasksResponse {
  return (
    !!data &&
    typeof data === 'object' &&
    Array.isArray((data as BackendTasksResponse).tasks)
  );
}

//===============================================================

export async function GET() {
  const token = await getSessionCookie();

  if (!token) {
    return createErrorResponse('Unauthorized.', 401);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/words/tasks`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await parseJsonSafe<
      BackendTasksResponse | { message?: string }
    >(response);

    if (!response.ok) {
      if (response.status === 401) {
        return createErrorResponse('Unauthorized.', 401);
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
          : 'Failed to fetch training tasks.',
        response.status || 500
      );
    }

    if (!isBackendTasksResponse(data)) {
      return createErrorResponse('Invalid training tasks response.', 500);
    }

    return createOkResponse(data);
  } catch {
    return createErrorResponse('Server error.', 500);
  }
}
