import { NextRequest } from 'next/server';

import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';
import { getWordsErrorMessage } from '@/lib/words/words-error';
import { normalizeOwnWordsResponse } from '@/lib/words/words-response';

import {
  parseServerJsonSafe,
  createErrorResponse,
  createOkResponse,
} from '@/lib/api/server-response';

import type { WordItem, WordSort } from '@/types/word';

//===============================================================

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 7;

//===============================================================

type BackendWordsResponse = {
  results: WordItem[];
  totalPages?: number;
  page?: number;
  perPage?: number;
};

type BackendRequestError = {
  status: number;
  message?: string;
};

//===============================================================

function isBackendWordsResponse(value: unknown): value is BackendWordsResponse {
  return (
    !!value &&
    typeof value === 'object' &&
    Array.isArray((value as { results?: unknown }).results)
  );
}

function getBackendMessage(data: unknown): string | undefined {
  if (
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof (data as { message?: unknown }).message === 'string'
  ) {
    return (data as { message: string }).message;
  }

  return undefined;
}

function getObjectIdTimestamp(id: string): number {
  if (id.length < 8) return 0;

  const hex = id.slice(0, 8);
  const parsed = Number.parseInt(hex, 16);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortWords(words: WordItem[], sort?: WordSort): WordItem[] {
  if (sort === 'a-z') {
    return [...words].sort((a, b) =>
      a.en.localeCompare(b.en, 'en', { sensitivity: 'base' })
    );
  }

  if (sort === 'z-a') {
    return [...words].sort((a, b) =>
      b.en.localeCompare(a.en, 'en', { sensitivity: 'base' })
    );
  }

  return [...words].sort((a, b) => {
    const timeDiff = getObjectIdTimestamp(b._id) - getObjectIdTimestamp(a._id);

    if (timeDiff !== 0) return timeDiff;

    return b._id.localeCompare(a._id);
  });
}

function repaginateWords(
  words: WordItem[],
  page: number,
  limit: number
): {
  results: WordItem[];
  totalPages: number;
  page: number;
  perPage: number;
} {
  const safePage = Number.isInteger(page) && page > 0 ? page : DEFAULT_PAGE;
  const safeLimit =
    Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_LIMIT;

  const totalPages = Math.max(1, Math.ceil(words.length / safeLimit));
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;

  return {
    results: words.slice(start, end),
    totalPages,
    page: safePage,
    perPage: safeLimit,
  };
}

async function fetchAllOwnWords(args: {
  token: string;
  keyword?: string;
  category?: string;
  isIrregular?: string;
}): Promise<WordItem[]> {
  const aggregated: WordItem[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const params = new URLSearchParams();

    if (args.keyword) {
      params.set('keyword', args.keyword);
    }

    if (args.category) {
      params.set('category', args.category);
    }

    if (args.isIrregular === 'true' || args.isIrregular === 'false') {
      params.set('isIrregular', args.isIrregular);
    }

    params.set('page', String(currentPage));
    params.set('limit', String(DEFAULT_LIMIT));

    const backendUrl = `${API_BASE_URL}/words/own?${params.toString()}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${args.token}`,
      },
      cache: 'no-store',
    });

    const data = await parseServerJsonSafe<unknown>(response);

    if (!response.ok) {
      throw {
        status: response.status,
        message: getBackendMessage(data),
      } satisfies BackendRequestError;
    }

    if (!isBackendWordsResponse(data)) {
      console.error('Unexpected /words/own payload:', data);
      throw new Error('Invalid own words response.');
    }

    aggregated.push(...data.results);

    const nextTotalPages =
      typeof data.totalPages === 'number'
        ? data.totalPages
        : data.results.length > 0
        ? currentPage
        : 1;

    totalPages = nextTotalPages;
    currentPage += 1;
  } while (currentPage <= totalPages);

  return aggregated;
}

//===============================================================

export async function GET(request: NextRequest) {
  const token = await getSessionCookie();

  if (!token) {
    return createErrorResponse('Unauthorized.', 401);
  }

  const { searchParams } = new URL(request.url);

  const keyword = searchParams.get('keyword')?.trim();
  const category = searchParams.get('category')?.trim();
  const isIrregular = searchParams.get('isIrregular');
  const page = Number(searchParams.get('page') ?? DEFAULT_PAGE);
  const limit = Number(searchParams.get('limit') ?? DEFAULT_LIMIT);
  const rawSort = searchParams.get('sort')?.trim();
  const sort =
    rawSort === 'a-z' || rawSort === 'z-a' ? (rawSort as WordSort) : undefined;

  try {
    const allWords = await fetchAllOwnWords({
      token,
      keyword,
      category,
      isIrregular: isIrregular ?? undefined,
    });

    const sortedWords = sortWords(allWords, sort);
    const repaginated = repaginateWords(sortedWords, page, limit);

    return createOkResponse(
      normalizeOwnWordsResponse(
        repaginated,
        Number.isInteger(page) && page > 0 ? page : DEFAULT_PAGE,
        Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_LIMIT
      )
    );
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      typeof (error as { status?: unknown }).status === 'number'
    ) {
      const typedError = error as BackendRequestError;

      return createErrorResponse(
        getWordsErrorMessage('own', typedError.status, typedError.message),
        typedError.status
      );
    }

    console.error('GET /api/words/own error:', error);
    return createErrorResponse('Failed to fetch user words.', 500);
  }
}
