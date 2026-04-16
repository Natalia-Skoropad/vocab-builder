import type { WordCategory, WordSort } from '@/types/word';

//===============================================================

export type WordsRouteFilters = {
  category: 'categories' | WordCategory;
  isIrregular?: boolean;
  page: number;
  sort?: WordSort;
};

type WordsRouteState = {
  filters: WordsRouteFilters;
};

//===============================================================

export const DEFAULT_WORDS_FILTERS: WordsRouteFilters = {
  category: 'categories',
  isIrregular: undefined,
  page: 1,
  sort: undefined,
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
  const categories: WordCategory[] = [
    'verb',
    'participle',
    'noun',
    'adjective',
    'pronoun',
    'numerals',
    'adverb',
    'preposition',
    'conjunction',
    'phrasal verb',
    'functional phrase',
  ];

  return categories.find((item) => slugify(item) === slug) ?? null;
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
