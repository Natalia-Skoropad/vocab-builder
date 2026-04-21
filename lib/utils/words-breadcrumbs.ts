import {
  buildWordsPath,
  formatDictionaryCategoryLabel,
  type WordProgressFilter,
} from '@/lib/utils/dictionary.query';

import type { WordCategory, WordSort } from '@/types/word';

//===============================================================

type Variant = 'dictionary' | 'recommend';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type WordsBreadcrumbFilters = {
  category: WordCategory | 'categories';
  isIrregular?: boolean;
  page: number;
  sort?: WordSort;
  progress?: WordProgressFilter;
};

//===============================================================

function getBasePath(variant: Variant): '/dictionary' | '/recommend' {
  return variant === 'recommend' ? '/recommend' : '/dictionary';
}

function getBaseLabel(variant: Variant): 'Dictionary' | 'Recommend' {
  return variant === 'recommend' ? 'Recommend' : 'Dictionary';
}

function formatProgressLabel(progress?: WordProgressFilter): string {
  switch (progress) {
    case '0':
      return '0% learned';
    case '50':
      return '50% learned';
    case '100':
      return '100% learned';
    default:
      return 'Progress';
  }
}

//===============================================================

export function buildWordsBreadcrumbs(
  variant: Variant,
  filters: WordsBreadcrumbFilters
): BreadcrumbItem[] {
  const basePath = getBasePath(variant);
  const baseLabel = getBaseLabel(variant);

  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: baseLabel, href: basePath },
  ];

  const hasCategory = filters.category !== 'categories';
  const hasIrregularFilter =
    filters.category === 'verb' && typeof filters.isIrregular === 'boolean';
  const hasProgressFilter = Boolean(filters.progress);

  if (hasCategory) {
    const categoryLabel = formatDictionaryCategoryLabel(filters.category);

    if (hasIrregularFilter) {
      items.push({
        label: categoryLabel,
        href: buildWordsPath(basePath, {
          category: filters.category,
          isIrregular: undefined,
          page: 1,
          sort: filters.sort,
          progress: filters.progress,
        }),
      });

      items.push({
        label: filters.isIrregular ? 'Irregular' : 'Regular',
        href: hasProgressFilter
          ? buildWordsPath(basePath, {
              category: filters.category,
              isIrregular: filters.isIrregular,
              page: 1,
              sort: filters.sort,
              progress: undefined,
            })
          : undefined,
      });
    } else {
      items.push({
        label: categoryLabel,
        href: hasProgressFilter
          ? buildWordsPath(basePath, {
              category: filters.category,
              isIrregular: undefined,
              page: 1,
              sort: filters.sort,
              progress: undefined,
            })
          : undefined,
      });
    }
  }

  if (hasProgressFilter) {
    items.push({
      label: formatProgressLabel(filters.progress),
    });
  }

  return items.map((item, index, array) =>
    index === array.length - 1 ? { ...item, href: undefined } : item
  );
}
