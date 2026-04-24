import type { WordCategory, WordsQueryParams, WordSort } from '@/types/word';
import { WORD_CATEGORIES } from '@/lib/constants/word-categories';

//===============================================================

export type WordProgressFilter = '0' | '50' | '100';

export type WordsRouteFilters = {
  category: 'categories' | WordCategory;
  isIrregular?: boolean;
  page: number;
  sort?: WordSort;
  progress?: WordProgressFilter;
};

type WordsRouteState = {
  filters: WordsRouteFilters;
};

type BuildWordsQueryParamsOptions = {
  wordsPerPage: number;
  keyword?: string;
  includeNewWordId?: boolean;
  newWordId?: string;
};

//===============================================================

export const DEFAULT_WORDS_FILTERS: WordsRouteFilters = {
  category: 'categories',
  isIrregular: undefined,
  page: 1,
  sort: undefined,
  progress: undefined,
};

export const DEFAULT_DICTIONARY_FILTERS = DEFAULT_WORDS_FILTERS;

//===============================================================

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function unslugCategory(slug: string): WordCategory | null {
  return WORD_CATEGORIES.find((item) => slugify(item) === slug) ?? null;
}

//===============================================================

export function parseDictionarySegments(segments?: string[]): WordsRouteState {
  const filters: WordsRouteFilters = {
    ...DEFAULT_WORDS_FILTERS,
  };

  if (!segments?.length) {
    return { filters };
  }

  for (const rawSegment of segments) {
    const segment = rawSegment.trim().toLowerCase();

    if (segment.startsWith('category-')) {
      const slug = segment.replace('category-', '');
      const category = unslugCategory(slug);

      if (category) {
        filters.category = category;
      }

      continue;
    }

    if (segment === 'irregular') {
      filters.isIrregular = true;
      continue;
    }

    if (segment === 'regular') {
      filters.isIrregular = false;
      continue;
    }

    if (segment === 'sort-a-z') {
      filters.sort = 'a-z';
      continue;
    }

    if (segment === 'sort-z-a') {
      filters.sort = 'z-a';
      continue;
    }

    if (segment === 'progress-100') {
      filters.progress = '100';
      continue;
    }

    if (segment === 'progress-50') {
      filters.progress = '50';
      continue;
    }

    if (segment === 'progress-0') {
      filters.progress = '0';
      continue;
    }

    if (segment.startsWith('page-')) {
      const page = Number(segment.replace('page-', ''));

      if (Number.isInteger(page) && page > 0) {
        filters.page = page;
      }
    }
  }

  if (filters.category !== 'verb') {
    filters.isIrregular = undefined;
  }

  return { filters };
}

//===============================================================

export function buildWordsQueryParams(
  filters: WordsRouteFilters,
  {
    wordsPerPage,
    keyword,
    includeNewWordId = false,
    newWordId,
  }: BuildWordsQueryParamsOptions
): WordsQueryParams {
  const normalizedKeyword = keyword?.trim() ?? '';
  const normalizedNewWordId = newWordId?.trim() ?? '';

  const params: WordsQueryParams = {
    page: filters.page,
    limit: wordsPerPage,
    keyword: normalizedKeyword || undefined,
    category: filters.category !== 'categories' ? filters.category : undefined,
    isIrregular: filters.category === 'verb' ? filters.isIrregular : undefined,
    sort: filters.sort,
  };

  if (includeNewWordId && normalizedNewWordId) {
    params.newWordId = normalizedNewWordId;
  }

  return params;
}

//===============================================================

export function buildWordsPath(
  basePath: '/dictionary' | '/recommend',
  filters: WordsRouteFilters
): string {
  const segments: string[] = [basePath];

  if (filters.category !== DEFAULT_WORDS_FILTERS.category) {
    segments.push(`category-${slugify(filters.category)}`);
  }

  if (filters.category === 'verb' && typeof filters.isIrregular === 'boolean') {
    segments.push(filters.isIrregular ? 'irregular' : 'regular');
  }

  if (filters.sort) {
    segments.push(filters.sort === 'a-z' ? 'sort-a-z' : 'sort-z-a');
  }

  if (filters.progress) {
    segments.push(`progress-${filters.progress}`);
  }

  if (filters.page > 1) {
    segments.push(`page-${String(filters.page)}`);
  }

  return segments.join('/');
}

export function buildDictionaryPath(filters: WordsRouteFilters): string {
  return buildWordsPath('/dictionary', filters);
}

//===============================================================

export function normalizeDictionaryPathname(pathname: string): string {
  const cleanedPath = pathname.replace(/\/+$/, '') || '/';
  const parts = cleanedPath.split('/').filter(Boolean);

  if (
    !parts.length ||
    (parts[0] !== 'dictionary' && parts[0] !== 'recommend')
  ) {
    return cleanedPath;
  }

  const basePath = parts[0] === 'recommend' ? '/recommend' : '/dictionary';

  const segments = parts.slice(1);
  const { filters } = parseDictionarySegments(segments);

  return buildWordsPath(basePath, filters);
}

//===============================================================

export function formatDictionaryCategoryLabel(
  category: 'categories' | WordCategory
): string {
  if (category === 'categories') return 'Dictionary';

  return category
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
