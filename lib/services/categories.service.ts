import type { WordCategory } from '@/types/word';

import {
  parseClientJsonSafe,
  throwIfResponseNotOk,
} from '@/lib/api/client-response';

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

  const data = await parseClientJsonSafe<WordCategory[] | ErrorResponse>(
    response
  );

  throwIfResponseNotOk(response, data, 'Failed to fetch categories.');

  if (!Array.isArray(data)) {
    throw new Error('Invalid categories response.');
  }

  return data;
}

//===============================================================

export const categoriesService = {
  getCategories,
};
