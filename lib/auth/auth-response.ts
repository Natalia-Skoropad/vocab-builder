import { NextResponse } from 'next/server';

//===============================================================

import type {
  AppUser,
  BackendAuthResponse,
  BackendCurrentUserResponse,
} from '@/types/auth';

type RouteAuthResponse = {
  user?: AppUser;
  message?: string;
  ok?: boolean;
};

//===============================================================

export async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

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

  return (
    typeof value._id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string'
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
    id: data._id,
    name: data.name,
    email: data.email,
  };
}

//===============================================================

export function createErrorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export function createUserResponse(user: AppUser, status = 200) {
  return NextResponse.json({ user }, { status });
}

export function createOkResponse(status = 200) {
  return NextResponse.json({ ok: true }, { status });
}

//===============================================================

export async function parseClientAuthResponse(
  response: Response,
  fallbackMessage: string
): Promise<RouteAuthResponse> {
  const data = await parseJsonSafe<RouteAuthResponse>(response);

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data || {};
}
