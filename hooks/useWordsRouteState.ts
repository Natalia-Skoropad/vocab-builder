'use client';

import { useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

import type { WordsQueryParams } from '@/types/word';

import {
  buildWordsPath,
  parseDictionarySegments,
} from '@/lib/utils/dictionary.query';

//===============================================================

type Variant = 'dictionary' | 'recommend';

type Options = {
  variant: Variant;
  wordsPerPage: number;
  includeNewWordId?: boolean;
};

//===============================================================

function getBasePath(variant: Variant): '/dictionary' | '/recommend' {
  return variant === 'recommend' ? '/recommend' : '/dictionary';
}

//===============================================================

export function useWordsRouteState({
  variant,
  wordsPerPage,
  includeNewWordId = false,
}: Options) {
  const params = useParams<{ filters?: string[] | string }>();
  const searchParams = useSearchParams();

  const rawFiltersParam = params.filters;
  const basePath = getBasePath(variant);

  const routeSegments = useMemo<string[]>(() => {
    if (Array.isArray(rawFiltersParam)) return rawFiltersParam;

    if (typeof rawFiltersParam === 'string' && rawFiltersParam.trim()) {
      return [rawFiltersParam];
    }

    return [];
  }, [rawFiltersParam]);

  const { filters } = useMemo(
    () => parseDictionarySegments(routeSegments),
    [routeSegments]
  );

  const keyword = searchParams.get('keyword')?.trim() ?? '';
  const newWordId = includeNewWordId
    ? searchParams.get('newWordId')?.trim() ?? ''
    : '';

  const queryParams = useMemo<WordsQueryParams>(() => {
    const nextParams: WordsQueryParams = {
      page: filters.page,
      limit: wordsPerPage,
      keyword: keyword || undefined,
      category:
        filters.category !== 'categories' ? filters.category : undefined,
      isIrregular:
        filters.category === 'verb' ? filters.isIrregular : undefined,
      sort: filters.sort,
    };

    if (includeNewWordId && newWordId) {
      nextParams.newWordId = newWordId;
    }

    return nextParams;
  }, [filters, includeNewWordId, keyword, newWordId, wordsPerPage]);

  const hasIrregularFilter = typeof filters.isIrregular === 'boolean';

  const hasActiveSearchOrFilters =
    Boolean(keyword) ||
    filters.category !== 'categories' ||
    Boolean(filters.sort) ||
    hasIrregularFilter ||
    Boolean(filters.progress);

  const buildPageUrl = useCallback(
    (nextPage: number) => {
      const nextPath = buildWordsPath(basePath, {
        category: filters.category,
        isIrregular:
          filters.category === 'verb' ? filters.isIrregular : undefined,
        page: nextPage,
        sort: filters.sort,
        progress: filters.progress,
      });

      const nextParams = new URLSearchParams();

      if (keyword) {
        nextParams.set('keyword', keyword);
      }

      const nextQuery = nextParams.toString();

      return nextQuery ? `${nextPath}?${nextQuery}` : nextPath;
    },
    [basePath, filters, keyword]
  );

  return {
    basePath,
    filters,
    keyword,
    newWordId,
    queryParams,
    hasIrregularFilter,
    hasActiveSearchOrFilters,
    routeSegments,
    buildPageUrl,
  };
}
