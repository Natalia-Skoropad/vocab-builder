import type { WordCategory } from '@/types/word';

//===============================================================

type ErrorResponse = {
  message?: string;
};

//===============================================================

async function getCategories(): Promise<WordCategory[]> {
  const response = await fetch('/api/words/categories', {
    method: 'GET',
    cache: 'no-store',
  });

  const data = (await response.json().catch(() => null)) as
    | WordCategory[]
    | ErrorResponse
    | null;

  if (!response.ok) {
    throw new Error(
      !Array.isArray(data) && data?.message
        ? data.message
        : 'Failed to fetch categories.'
    );
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid categories response.');
  }

  return data;
}

//===============================================================

export const categoriesService = {
  getCategories,
};
