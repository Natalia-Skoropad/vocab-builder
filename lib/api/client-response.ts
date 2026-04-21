import type { TrainingSubmitResponse } from '@/types/training';

//===============================================================

function getErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;

  const value = data as { message?: unknown };

  return typeof value.message === 'string' ? value.message : null;
}

//===============================================================

export async function parseClientJsonSafe<T>(
  response: Response
): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

//===============================================================

export function throwIfResponseNotOk(
  response: Response,
  data: unknown,
  fallbackMessage: string
): void {
  if (response.ok) return;

  throw new Error(getErrorMessage(data) ?? fallbackMessage);
}

//===============================================================

export function assertPaginatedWordsResponse(data: unknown): asserts data is {
  results: unknown[];
  totalPages: number;
  page: number;
  perPage: number;
} {
  if (
    !data ||
    typeof data !== 'object' ||
    !Array.isArray((data as { results?: unknown[] }).results) ||
    typeof (data as { totalPages?: unknown }).totalPages !== 'number' ||
    typeof (data as { page?: unknown }).page !== 'number' ||
    typeof (data as { perPage?: unknown }).perPage !== 'number'
  ) {
    throw new Error('Invalid words response.');
  }
}

//===============================================================

export function assertDeleteResponse(
  data: unknown
): asserts data is { message: string; id: string } {
  if (
    !data ||
    typeof data !== 'object' ||
    typeof (data as { id?: unknown }).id !== 'string' ||
    typeof (data as { message?: unknown }).message !== 'string'
  ) {
    throw new Error('Invalid delete response.');
  }
}

//===============================================================

export function assertTrainingSubmitResponse(
  data: unknown
): asserts data is TrainingSubmitResponse {
  const isValid =
    Array.isArray(data) &&
    data.every(
      (item) =>
        !!item &&
        typeof item === 'object' &&
        typeof item._id === 'string' &&
        typeof item.en === 'string' &&
        typeof item.ua === 'string' &&
        (item.task === 'en' || item.task === 'ua') &&
        typeof item.isDone === 'boolean'
    );

  if (!isValid) {
    throw new Error('Invalid training submit response.');
  }
}
