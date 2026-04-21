import type { AddWordFormValues } from '@/types/forms';
import type { WordsResponse, WordItem, WordsQueryParams } from '@/types/word';
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

const LEARNED_COUNT_FALLBACK_LIMIT = 1000;

//===============================================================

function isWordItem(data: unknown): data is WordItem {
  return (
    !!data &&
    typeof data === 'object' &&
    typeof (data as { _id?: unknown })._id === 'string' &&
    typeof (data as { en?: unknown }).en === 'string' &&
    typeof (data as { ua?: unknown }).ua === 'string' &&
    typeof (data as { category?: unknown }).category === 'string'
  );
}

//===============================================================

function assertWordItem(
  data: unknown,
  fallbackMessage: string
): asserts data is WordItem {
  if (!isWordItem(data)) {
    throw new Error(fallbackMessage);
  }
}

//===============================================================

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

//===============================================================

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

//===============================================================

async function parseWordsResponse(
  response: Response,
  fallbackMessage: string
): Promise<WordsResponse> {
  const data = await parseClientJsonSafe<WordsResponse | ErrorResponse>(
    response
  );

  throwIfResponseNotOk(response, data, fallbackMessage);
  assertPaginatedWordsResponse(data);

  return data;
}

//===============================================================

async function getOwnWords(
  params: WordsQueryParams = {}
): Promise<WordsResponse> {
  const query = buildWordsQuery(params);
  const url = `/api/words/own${query ? `?${query}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  });

  return parseWordsResponse(response, 'Failed to fetch words.');
}

async function getAllWords(
  params: WordsQueryParams = {}
): Promise<WordsResponse> {
  const query = buildWordsQuery(params);
  const url = `/api/words/recommend${query ? `?${query}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  });

  return parseWordsResponse(response, 'Failed to fetch recommended words.');
}

//===============================================================

async function getStatistics(): Promise<WordsStatisticsResponse> {
  const response = await fetch('/api/words/statistics', {
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

async function getLearnedWordsCount(): Promise<number> {
  const response = await getOwnWords({
    page: 1,
    limit: LEARNED_COUNT_FALLBACK_LIMIT,
  });

  return getLearnedWordsCountFromResults(response.results);
}

//===============================================================

async function deleteWord(id: string): Promise<DeleteWordResponse> {
  const response = await fetch(`/api/words/delete/${id}`, {
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
  const response = await fetch('/api/words/create', {
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
  assertWordItem(data, 'Invalid create response.');

  return data;
}

//===============================================================

async function editWord(params: EditWordParams): Promise<WordItem> {
  const response = await fetch(`/api/words/edit/${params.id}`, {
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
  assertWordItem(data, 'Invalid edit response.');

  return data;
}

//===============================================================

async function addWordFromRecommend(id: string): Promise<WordItem> {
  const response = await fetch(`/api/words/add/${id}`, {
    method: 'POST',
    cache: 'no-store',
  });

  const data = await parseClientJsonSafe<WordItem | ErrorResponse>(response);

  throwIfResponseNotOk(response, data, 'Failed to add word to dictionary.');
  assertWordItem(data, 'Invalid add-to-dictionary response.');

  return data;
}

//===============================================================

export const wordsService = {
  getOwnWords,
  getAllWords,
  getStatistics,
  getLearnedWordsCount,
  deleteWord,
  createWord,
  editWord,
  addWordFromRecommend,
};
