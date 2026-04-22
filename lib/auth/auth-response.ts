import type {
  AppUser,
  BackendAuthResponse,
  BackendCurrentUserResponse,
} from '@/types/auth';

import { parseClientJsonSafe } from '@/lib/api/client-response';
import { createOkResponse } from '@/lib/api/server-response';

//===============================================================

type RouteAuthResponse = {
  user?: AppUser;
  message?: string;
  ok?: boolean;
};

//===============================================================

export function isBackendAuthResponse(
  data: unknown
): data is BackendAuthResponse {
  if (!data || typeof data !== 'object') return false;

  const value = data as Record<string, unknown>;

  return (
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.token === 'string'
  );
}

//===============================================================

export function isBackendCurrentUserResponse(
  data: unknown
): data is BackendCurrentUserResponse {
  if (!data || typeof data !== 'object') return false;

  const value = data as Record<string, unknown>;
  const hasValidId =
    typeof value._id === 'string' || typeof value.id === 'string';

  return (
    hasValidId &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.token === 'string'
  );
}

//===============================================================

export function buildUserFromBackendAuth(data: BackendAuthResponse): AppUser {
  return {
    name: data.name,
    email: data.email,
  };
}

//===============================================================

export function buildUserFromBackendCurrent(
  data: BackendCurrentUserResponse
): AppUser {
  return {
    id: data._id ?? data.id,
    name: data.name,
    email: data.email,
  };
}

//===============================================================

export function createUserResponse(user: AppUser, status = 200) {
  return createOkResponse({ user }, status);
}

export function createAuthOkResponse(status = 200) {
  return createOkResponse({ ok: true }, status);
}

//===============================================================

export async function parseClientAuthResponse(
  response: Response,
  fallbackMessage: string
): Promise<RouteAuthResponse> {
  const data = await parseClientJsonSafe<RouteAuthResponse>(response);

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data || {};
}
