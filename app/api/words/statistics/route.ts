import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';
import { getWordsErrorMessage } from '@/lib/words/words-error';

import {
  createErrorResponse,
  createOkResponse,
  isStatisticsResponse,
  parseJsonSafe,
} from '@/lib/words/words-response';

//===============================================================

export async function GET() {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return createErrorResponse(getWordsErrorMessage('statistics', 401), 401);
    }

    const response = await fetch(`${API_BASE_URL}/words/statistics`, {
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
          'statistics',
          response.status,
          'Failed to fetch statistics.'
        ),
        response.status
      );
    }

    if (!isStatisticsResponse(data)) {
      return createErrorResponse('Invalid server response.', 500);
    }

    return createOkResponse(data);
  } catch (error) {
    console.error('GET /api/words/statistics error:', error);
    return createErrorResponse(getWordsErrorMessage('statistics', 500), 500);
  }
}
