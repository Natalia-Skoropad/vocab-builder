import { NextResponse } from 'next/server';

//===============================================================

export async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

//===============================================================

export function createErrorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export function createOkResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

//===============================================================

export function isStatisticsResponse(
  data: unknown
): data is { totalCount: number } {
  return (
    !!data &&
    typeof data === 'object' &&
    typeof (data as { totalCount?: unknown }).totalCount === 'number'
  );
}

export function isOwnWordsResponse(data: unknown): data is {
  results: unknown[];
  totalPages?: number;
  page?: number;
  perPage?: number;
} {
  return (
    !!data &&
    typeof data === 'object' &&
    Array.isArray((data as { results?: unknown }).results)
  );
}

export function normalizeOwnWordsResponse(
  data: {
    results: unknown[];
    totalPages?: number;
    page?: number;
    perPage?: number;
  },
  fallbackPage: number,
  fallbackPerPage: number
) {
  return {
    results: data.results,
    totalPages: typeof data.totalPages === 'number' ? data.totalPages : 1,
    page: typeof data.page === 'number' ? data.page : fallbackPage,
    perPage: typeof data.perPage === 'number' ? data.perPage : fallbackPerPage,
  };
}
