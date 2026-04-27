import { NextRequest } from 'next/server';

import { API_BASE_URL } from '@/lib/constants/api';
import { getSessionCookie } from '@/lib/server/auth/session';
import { normalizeOwnWordsResponse } from '@/lib/words/words-response';

import {
  parseServerJsonSafe,
  createErrorResponse,
  createOkResponse,
} from '@/lib/api/server-response';

import type { RecommendedWordItem, WordSort } from '@/types/word';

//===============================================================

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 7;

//===============================================================

type BackendWordsResponse = {
  results: RecommendedWordItem[];
  totalPages?: number;
  page?: number;
  perPage?: number;
};

type BackendRequestError = {
  status: number;
  message?: string;
};

//===============================================================

function isRecommendedWordItem(value: unknown): value is RecommendedWordItem {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as { _id?: unknown })._id === 'string' &&
    typeof (value as { en?: unknown }).en === 'string' &&
    typeof (value as { ua?: unknown }).ua === 'string' &&
    typeof (value as { category?: unknown }).category === 'string'
  );
}

function isBackendWordsResponse(value: unknown): value is BackendWordsResponse {
  return (
    !!value &&
    typeof value === 'object' &&
    Array.isArray((value as { results?: unknown }).results) &&
    (value as { results: unknown[] }).results.every(isRecommendedWordItem)
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

function getSafePage(value: number): number {
  return Number.isInteger(value) && value > 0 ? value : DEFAULT_PAGE;
}

function getSafeLimit(value: number): number {
  return Number.isInteger(value) && value > 0 ? value : DEFAULT_LIMIT;
}

function getObjectIdTimestamp(id: string): number {
  if (id.length < 8) return 0;

  const hex = id.slice(0, 8);
  const parsed = Number.parseInt(hex, 16);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortWords(
  words: RecommendedWordItem[],
  sort?: WordSort
): RecommendedWordItem[] {
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
  words: RecommendedWordItem[],
  page: number,
  limit: number
): {
  results: RecommendedWordItem[];
  totalPages: number;
  page: number;
  perPage: number;
} {
  const safePage = getSafePage(page);
  const safeLimit = getSafeLimit(limit);

  const totalPages = Math.max(1, Math.ceil(words.length / safeLimit));
  const currentPage = Math.min(safePage, totalPages);
  const start = (currentPage - 1) * safeLimit;

  return {
    results: words.slice(start, start + safeLimit),
    totalPages,
    page: currentPage,
    perPage: safeLimit,
  };
}

function buildBackendParams({
  keyword,
  category,
  isIrregular,
  page,
  limit,
}: {
  keyword?: string;
  category?: string;
  isIrregular?: string;
  page: number;
  limit: number;
}) {
  const params = new URLSearchParams();

  if (keyword) params.set('keyword', keyword);
  if (category) params.set('category', category);
  if (isIrregular) params.set('isIrregular', isIrregular);

  params.set('page', String(page));
  params.set('limit', String(limit));

  return params;
}

async function fetchRecommendedWordsPage({
  token,
  keyword,
  category,
  isIrregular,
  page,
  limit,
}: {
  token: string;
  keyword?: string;
  category?: string;
  isIrregular?: string;
  page: number;
  limit: number;
}): Promise<BackendWordsResponse> {
  const params = buildBackendParams({
    keyword,
    category,
    isIrregular,
    page,
    limit,
  });

  const response = await fetch(`${API_BASE_URL}/words/all?${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
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
    throw new Error('Invalid recommend words response.');
  }

  return data;
}

async function fetchAllRecommendedWords({
  token,
  keyword,
  category,
  isIrregular,
}: {
  token: string;
  keyword?: string;
  category?: string;
  isIrregular?: string;
}): Promise<RecommendedWordItem[]> {
  const aggregated: RecommendedWordItem[] = [];
  let currentPage = DEFAULT_PAGE;
  let totalPages = DEFAULT_PAGE;

  do {
    const data = await fetchRecommendedWordsPage({
      token,
      keyword,
      category,
      isIrregular,
      page: currentPage,
      limit: DEFAULT_LIMIT,
    });

    aggregated.push(...data.results);

    totalPages =
      typeof data.totalPages === 'number' && data.totalPages > 0
        ? data.totalPages
        : currentPage;

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

  const keyword = searchParams.get('keyword')?.trim() || undefined;
  const category = searchParams.get('category')?.trim() || undefined;
  const isIrregular = searchParams.get('isIrregular') ?? undefined;

  const page = getSafePage(Number(searchParams.get('page') ?? DEFAULT_PAGE));
  const limit = getSafeLimit(
    Number(searchParams.get('limit') ?? DEFAULT_LIMIT)
  );

  const rawSort = searchParams.get('sort')?.trim();
  const sort =
    rawSort === 'a-z' || rawSort === 'z-a' ? (rawSort as WordSort) : undefined;

  try {
    if (!sort) {
      const data = await fetchRecommendedWordsPage({
        token,
        keyword,
        category,
        isIrregular,
        page,
        limit,
      });

      return createOkResponse(normalizeOwnWordsResponse(data, page, limit));
    }

    const allWords = await fetchAllRecommendedWords({
      token,
      keyword,
      category,
      isIrregular,
    });

    const sortedWords = sortWords(allWords, sort);
    const repaginated = repaginateWords(sortedWords, page, limit);

    return createOkResponse(
      normalizeOwnWordsResponse(repaginated, page, limit)
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
        typedError.message || 'Failed to fetch recommended words.',
        typedError.status
      );
    }

    console.error('GET /api/words/recommend error:', error);
    return createErrorResponse('Failed to fetch recommended words.', 500);
  }
}
