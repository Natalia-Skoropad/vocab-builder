export function isStatisticsResponse(
  data: unknown
): data is { totalCount: number } {
  return (
    !!data &&
    typeof data === 'object' &&
    typeof (data as { totalCount?: unknown }).totalCount === 'number'
  );
}

//===============================================================

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

//===============================================================

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
