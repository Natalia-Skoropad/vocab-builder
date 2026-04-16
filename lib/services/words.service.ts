import type { AddWordFormValues } from '@/types/forms';
import type { WordsResponse, WordItem, WordsQueryParams } from '@/types/word';
import type { WordsStatisticsResponse } from '@/types/statistics';

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

function isWordsStatisticsResponse(
  data: unknown
): data is WordsStatisticsResponse {
  return (
    !!data &&
    typeof data === 'object' &&
    typeof (data as { totalCount?: unknown }).totalCount === 'number'
  );
}

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

  return searchParams.toString();
}

async function parseWordsResponse(
  response: Response,
  fallbackMessage: string
): Promise<WordsResponse> {
  const data = (await response.json().catch(() => null)) as
    | WordsResponse
    | ErrorResponse
    | null;

  if (!response.ok) {
    throw new Error(
      data && !('results' in data) && data.message
        ? data.message
        : fallbackMessage
    );
  }

  if (
    !data ||
    !('results' in data) ||
    !Array.isArray(data.results) ||
    typeof data.totalPages !== 'number' ||
    typeof data.page !== 'number' ||
    typeof data.perPage !== 'number'
  ) {
    throw new Error('Invalid words response.');
  }

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

  const data = (await response.json().catch(() => null)) as
    | WordsStatisticsResponse
    | ErrorResponse
    | null;

  if (!response.ok) {
    throw new Error(
      data && 'message' in data && data.message
        ? data.message
        : 'Failed to fetch statistics.'
    );
  }

  if (!isWordsStatisticsResponse(data)) {
    throw new Error('Invalid statistics response.');
  }

  return data;
}

//===============================================================

async function deleteWord(id: string): Promise<DeleteWordResponse> {
  const response = await fetch(`/api/words/delete/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  const data = (await response.json().catch(() => null)) as
    | DeleteWordResponse
    | ErrorResponse
    | null;

  if (!response.ok) {
    throw new Error(
      data && 'message' in data && data.message
        ? data.message
        : 'Failed to delete word.'
    );
  }

  if (
    !data ||
    typeof data !== 'object' ||
    typeof (data as { id?: unknown }).id !== 'string' ||
    typeof (data as { message?: unknown }).message !== 'string'
  ) {
    throw new Error('Invalid delete response.');
  }

  return data as DeleteWordResponse;
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

  const data = (await response.json().catch(() => null)) as
    | WordItem
    | ErrorResponse
    | null;

  if (!response.ok) {
    throw new Error(
      data && 'message' in data && data.message
        ? data.message
        : 'Failed to create word.'
    );
  }

  if (!isWordItem(data)) {
    throw new Error('Invalid create response.');
  }

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

  const data = (await response.json().catch(() => null)) as
    | WordItem
    | ErrorResponse
    | null;

  if (!response.ok) {
    throw new Error(
      data && 'message' in data && data.message
        ? data.message
        : 'Failed to edit word.'
    );
  }

  if (!isWordItem(data)) {
    throw new Error('Invalid edit response.');
  }

  return data;
}

//===============================================================

export const wordsService = {
  getOwnWords,
  getAllWords,
  getStatistics,
  deleteWord,
  createWord,
  editWord,
};
