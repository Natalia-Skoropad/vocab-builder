import {
  buildWordsPath,
  formatDictionaryCategoryLabel,
  type WordsRouteFilters,
} from '@/lib/utils/dictionary.query';

//===============================================================

type Variant = 'dictionary' | 'recommend';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

//===============================================================

function getBasePath(variant: Variant): '/dictionary' | '/recommend' {
  return variant === 'recommend' ? '/recommend' : '/dictionary';
}

function getBaseLabel(variant: Variant): 'Dictionary' | 'Recommend' {
  return variant === 'recommend' ? 'Recommend' : 'Dictionary';
}

function formatProgressLabel(progress?: WordsRouteFilters['progress']): string {
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
  filters: WordsRouteFilters
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
          ...filters,
          isIrregular: undefined,
          page: 1,
        }),
      });

      items.push({
        label: filters.isIrregular ? 'Irregular' : 'Regular',
        href: hasProgressFilter
          ? buildWordsPath(basePath, {
              ...filters,
              page: 1,
              progress: undefined,
            })
          : undefined,
      });
    } else {
      items.push({
        label: categoryLabel,
        href: hasProgressFilter
          ? buildWordsPath(basePath, {
              ...filters,
              page: 1,
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
