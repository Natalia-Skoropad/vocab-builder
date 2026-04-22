import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';

import {
  parseServerJsonSafe,
  createErrorResponse,
  createOkResponse,
} from '@/lib/api/server-response';

//===============================================================

type BackendTaskItem = {
  _id: string;
  en?: string;
  ua?: string;
  task: 'en' | 'ua';
};

type BackendTasksResponse =
  | {
      words: BackendTaskItem[];
    }
  | {
      tasks: BackendTaskItem[];
    };

type BackendErrorResponse = {
  message?: string;
};

//===============================================================

function isBackendTaskItem(value: unknown): value is BackendTaskItem {
  if (!value || typeof value !== 'object') return false;

  const item = value as Record<string, unknown>;

  const hasValidPrompt =
    typeof item.en === 'string' || typeof item.ua === 'string';

  return (
    typeof item._id === 'string' &&
    hasValidPrompt &&
    (item.task === 'en' || item.task === 'ua')
  );
}

function isBackendTasksResponse(value: unknown): value is BackendTasksResponse {
  if (!value || typeof value !== 'object') return false;

  const data = value as Record<string, unknown>;

  if (Array.isArray(data.words)) {
    return data.words.every(isBackendTaskItem);
  }

  if (Array.isArray(data.tasks)) {
    return data.tasks.every(isBackendTaskItem);
  }

  return false;
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

function normalizeTasksResponse(data: BackendTasksResponse) {
  if ('words' in data) {
    return {
      words: data.words,
    };
  }

  return {
    words: data.tasks,
  };
}

//===============================================================

export async function GET() {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return createErrorResponse('Unauthorized.', 401);
    }

    const response = await fetch(`${API_BASE_URL}/words/tasks`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await parseServerJsonSafe<unknown>(response);

    if (!response.ok) {
      if (response.status === 401) {
        return createErrorResponse('Unauthorized.', 401);
      }

      if (response.status === 404) {
        return createErrorResponse('Service not found.', 404);
      }

      return createErrorResponse(
        getBackendMessage(data) || 'Failed to fetch training tasks.',
        response.status || 500
      );
    }

    if (!isBackendTasksResponse(data)) {
      return createErrorResponse('Invalid training tasks response.', 500);
    }

    return createOkResponse(normalizeTasksResponse(data));
  } catch (error) {
    console.error('GET /api/training/tasks error:', error);
    return createErrorResponse('Server error.', 500);
  }
}
