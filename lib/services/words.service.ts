import type { AddWordFormValues } from '@/types/forms';

import type {
  OwnWordsResponse,
  RecommendedWordItem,
  RecommendedWordsResponse,
  WordItem,
  WordsQueryParams,
} from '@/types/word';

import type { WordsStatisticsResponse } from '@/types/statistics';

import {
  assertDeleteResponse,
  assertPaginatedWordsResponse,
  parseClientJsonSafe,
  throwIfResponseNotOk,
} from '@/lib/api/client-response';

import { isStatisticsResponse } from '@/lib/words/words-response';

//===============================================================

type ErrorResponse = {
  message?: string;
};

type DeleteWordResponse = {
  message: string;
  id: string;
};

type EditWordParams = {
  id: string;
  en: string;
  ua: string;
  category: string;
  isIrregular?: boolean;
};

//===============================================================

const LEARNED_WORDS_COUNT_FALLBACK_LIMIT = 1000;

const WORDS_ENDPOINTS = {
  own: '/api/words/own',
  recommend: '/api/words/recommend',
  statistics: '/api/words/statistics',
  create: '/api/words/create',
  delete: (id: string) => `/api/words/delete/${id}`,
  edit: (id: string) => `/api/words/edit/${id}`,
  addFromRecommend: (id: string) => `/api/words/add/${id}`,
} as const;

//===============================================================

function isBaseWordShape(data: unknown): data is {
  _id: string;
  en: string;
  ua: string;
  category: string;
  isIrregular?: boolean;
} {
  return (
    !!data &&
    typeof data === 'object' &&
    typeof (data as { _id?: unknown })._id === 'string' &&
    typeof (data as { en?: unknown }).en === 'string' &&
    typeof (data as { ua?: unknown }).ua === 'string' &&
    typeof (data as { category?: unknown }).category === 'string'
  );
}

function isOwnWordItem(data: unknown): data is WordItem {
  return (
    isBaseWordShape(data) &&
    typeof (data as { progress?: unknown }).progress === 'number'
  );
}

function isRecommendedWordItem(data: unknown): data is RecommendedWordItem {
  return (
    isBaseWordShape(data) &&
    (typeof (data as { progress?: unknown }).progress === 'number' ||
      typeof (data as { progress?: unknown }).progress === 'undefined')
  );
}

function assertOwnWordItem(
  data: unknown,
  fallbackMessage: string
): asserts data is WordItem {
  if (!isOwnWordItem(data)) {
    throw new Error(fallbackMessage);
  }
}

function assertOwnWordsResponse(
  data: unknown
): asserts data is OwnWordsResponse {
  assertPaginatedWordsResponse(data);

  if (!data.results.every(isOwnWordItem)) {
    throw new Error('Invalid words response.');
  }
}

function assertRecommendedWordsResponse(
  data: unknown
): asserts data is RecommendedWordsResponse {
  assertPaginatedWordsResponse(data);

  if (!data.results.every(isRecommendedWordItem)) {
    throw new Error('Invalid recommended words response.');
  }
}

function buildWordsQuery(params: WordsQueryParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.keyword?.trim()) {
    searchParams.set('keyword', params.keyword.trim());
  }

  if (params.category?.trim() && params.category !== 'categories') {
    searchParams.set('category', params.category.trim());
  }

  if (typeof params.isIrregular === 'boolean') {
    searchParams.set('isIrregular', String(params.isIrregular));
  }

  if (typeof params.page === 'number') {
    searchParams.set('page', String(params.page));
  }

  if (typeof params.limit === 'number') {
    searchParams.set('limit', String(params.limit));
  }

  if (params.sort) {
    searchParams.set('sort', params.sort);
  }

  if (params.newWordId?.trim()) {
    searchParams.set('newWordId', params.newWordId.trim());
  }

  return searchParams.toString();
}

function getLearnedWordsCountFromResults(
  results: Array<{ progress: number | string }>
): number {
  return results.filter((word) => {
    const progress =
      typeof word.progress === 'number'
        ? word.progress
        : Number(word.progress) || 0;

    return progress >= 100;
  }).length;
}

async function parseOwnWordsResponse(
  response: Response,
  fallbackMessage: string
): Promise<OwnWordsResponse> {
  const data = await parseClientJsonSafe<OwnWordsResponse | ErrorResponse>(
    response
  );

  throwIfResponseNotOk(response, data, fallbackMessage);
  assertOwnWordsResponse(data);

  return data;
}

async function parseRecommendedWordsResponse(
  response: Response,
  fallbackMessage: string
): Promise<RecommendedWordsResponse> {
  const data = await parseClientJsonSafe<
    RecommendedWordsResponse | ErrorResponse
  >(response);

  throwIfResponseNotOk(response, data, fallbackMessage);
  assertRecommendedWordsResponse(data);

  return data;
}

//===============================================================

async function getOwnWords(
  params: WordsQueryParams = {}
): Promise<OwnWordsResponse> {
  const query = buildWordsQuery(params);
  const url = `${WORDS_ENDPOINTS.own}${query ? `?${query}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  });

  return parseOwnWordsResponse(response, 'Failed to fetch words.');
}

async function getAllWords(
  params: WordsQueryParams = {}
): Promise<RecommendedWordsResponse> {
  const query = buildWordsQuery(params);
  const url = `${WORDS_ENDPOINTS.recommend}${query ? `?${query}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  });

  return parseRecommendedWordsResponse(
    response,
    'Failed to fetch recommended words.'
  );
}

//===============================================================

async function getStatistics(): Promise<WordsStatisticsResponse> {
  const response = await fetch(WORDS_ENDPOINTS.statistics, {
    method: 'GET',
    cache: 'no-store',
  });

  const data = await parseClientJsonSafe<
    WordsStatisticsResponse | ErrorResponse
  >(response);

  throwIfResponseNotOk(response, data, 'Failed to fetch statistics.');

  if (!isStatisticsResponse(data)) {
    throw new Error('Invalid statistics response.');
  }

  return data;
}

//===============================================================

/**
 * Temporary frontend fallback for learned words count.
 * The backend does not provide a dedicated learned-count endpoint yet,
 * so we fetch a capped list of own words and count progress >= 100 on the client.
 */
async function getLearnedWordsCountFallback(): Promise<number> {
  const response = await getOwnWords({
    page: 1,
    limit: LEARNED_WORDS_COUNT_FALLBACK_LIMIT,
  });

  return getLearnedWordsCountFromResults(response.results);
}

//===============================================================

async function deleteWord(id: string): Promise<DeleteWordResponse> {
  const response = await fetch(WORDS_ENDPOINTS.delete(id), {
    method: 'DELETE',
    cache: 'no-store',
  });

  const data = await parseClientJsonSafe<DeleteWordResponse | ErrorResponse>(
    response
  );

  throwIfResponseNotOk(response, data, 'Failed to delete word.');
  assertDeleteResponse(data);

  return data;
}

//===============================================================

async function createWord(values: AddWordFormValues): Promise<WordItem> {
  const response = await fetch(WORDS_ENDPOINTS.create, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category: values.category,
      isIrregular: values.category === 'verb' ? values.isIrregular : undefined,
      ua: values.ua.trim(),
      en: values.en.trim(),
    }),
    cache: 'no-store',
  });

  const data = await parseClientJsonSafe<WordItem | ErrorResponse>(response);

  throwIfResponseNotOk(response, data, 'Failed to create word.');
  assertOwnWordItem(data, 'Invalid create response.');

  return data;
}

//===============================================================

async function editWord(params: EditWordParams): Promise<WordItem> {
  const response = await fetch(WORDS_ENDPOINTS.edit(params.id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      en: params.en.trim(),
      ua: params.ua.trim(),
      category: params.category,
      isIrregular: params.category === 'verb' ? params.isIrregular : undefined,
    }),
    cache: 'no-store',
  });

  const data = await parseClientJsonSafe<WordItem | ErrorResponse>(response);

  throwIfResponseNotOk(response, data, 'Failed to edit word.');
  assertOwnWordItem(data, 'Invalid edit response.');

  return data;
}

//===============================================================

async function addWordFromRecommend(id: string): Promise<WordItem> {
  const response = await fetch(WORDS_ENDPOINTS.addFromRecommend(id), {
    method: 'POST',
    cache: 'no-store',
  });

  const data = await parseClientJsonSafe<WordItem | ErrorResponse>(response);

  throwIfResponseNotOk(response, data, 'Failed to add word to dictionary.');
  assertOwnWordItem(data, 'Invalid add-to-dictionary response.');

  return data;
}

//===============================================================

export const wordsService = {
  getOwnWords,
  getAllWords,
  getStatistics,
  getLearnedWordsCountFallback,
  deleteWord,
  createWord,
  editWord,
  addWordFromRecommend,
};
