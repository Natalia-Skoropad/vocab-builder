'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import type { WordSort } from '@/types/word';
import { useDebounce } from '@/hooks/useDebounce';
import { useCategoriesStore } from '@/store/categories/categoriesStore';

import {
  buildWordsPath,
  parseDictionarySegments,
  type WordProgressFilter,
} from '@/lib/utils/dictionary.query';

import type { RadioOption } from '@/components/common/RadioGroup/RadioGroup';

//===============================================================

type Variant = 'dictionary' | 'recommend';

export type SortValue = 'sort' | WordSort;
export type ProgressValue = 'progress' | WordProgressFilter;

//===============================================================

const verbOptions: RadioOption[] = [
  { value: 'regular', label: 'Regular' },
  { value: 'irregular', label: 'Irregular' },
];

const sortOptions = [
  { value: 'sort', label: 'Sort' },
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
];

const progressOptions = [
  { value: 'progress', label: 'Progress' },
  { value: '100', label: '100% learned' },
  { value: '50', label: '50% learned' },
  { value: '0', label: '0% learned' },
];

//===============================================================

type Options = {
  variant: Variant;
  onAppliedStateChange?: (value: boolean, count: number) => void;
};

//===============================================================

export function useWordsFiltersState({
  variant,
  onAppliedStateChange,
}: Options) {
  const router = useRouter();
  const params = useParams<{ filters?: string[] | string }>();
  const searchParams = useSearchParams();

  const categories = useCategoriesStore((state) => state.categories);
  const categoriesStatus = useCategoriesStore((state) => state.status);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  useEffect(() => {
    if (categoriesStatus === 'success' || categoriesStatus === 'loading') {
      return;
    }

    void fetchCategories();
  }, [categoriesStatus, fetchCategories]);

  const rawFiltersParam = params.filters;
  const basePath = variant === 'recommend' ? '/recommend' : '/dictionary';

  const routeSegments = useMemo<string[]>(() => {
    if (Array.isArray(rawFiltersParam)) return rawFiltersParam;

    if (typeof rawFiltersParam === 'string' && rawFiltersParam.trim()) {
      return [rawFiltersParam];
    }

    return [];
  }, [rawFiltersParam]);

  const { filters: routeFilters } = useMemo(
    () => parseDictionarySegments(routeSegments),
    [routeSegments]
  );

  const initialKeyword = searchParams.get('keyword') ?? '';

  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(routeFilters.category);
  const [verbType, setVerbType] = useState<'regular' | 'irregular'>(
    routeFilters.isIrregular === true ? 'irregular' : 'regular'
  );

  const [sort, setSort] = useState<SortValue>(routeFilters.sort ?? 'sort');
  const [progress, setProgress] = useState<ProgressValue>(
    routeFilters.progress ?? 'progress'
  );

  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  useEffect(() => {
    setCategory(routeFilters.category);
  }, [routeFilters.category]);

  useEffect(() => {
    setVerbType(routeFilters.isIrregular === true ? 'irregular' : 'regular');
  }, [routeFilters.isIrregular]);

  useEffect(() => {
    setSort(routeFilters.sort ?? 'sort');
  }, [routeFilters.sort]);

  useEffect(() => {
    setProgress(routeFilters.progress ?? 'progress');
  }, [routeFilters.progress]);

  const normalizedKeyword = useMemo(
    () => debouncedKeyword.trim(),
    [debouncedKeyword]
  );

  const isVerb = category === 'verb';
  const effectiveSort = sort === 'sort' ? undefined : sort;
  const effectiveProgress =
    progress === 'progress' ? undefined : (progress as WordProgressFilter);

  const hasAppliedSort = sort !== 'sort';
  const hasAppliedCategory = category !== 'categories';
  const hasAppliedProgress = progress !== 'progress';
  const hasAppliedVerbType = category === 'verb' && verbType === 'irregular';

  const activeFiltersCount = [
    hasAppliedCategory,
    hasAppliedProgress,
    hasAppliedVerbType,
  ].filter(Boolean).length;

  const hasAppliedFilters = activeFiltersCount > 0;

  useEffect(() => {
    onAppliedStateChange?.(hasAppliedFilters, activeFiltersCount);
  }, [activeFiltersCount, hasAppliedFilters, onAppliedStateChange]);

  useEffect(() => {
    const currentKeyword = searchParams.get('keyword')?.trim() ?? '';
    const currentSort = routeFilters.sort ?? 'sort';
    const currentCategory = routeFilters.category;
    const currentProgress = routeFilters.progress ?? 'progress';
    const currentIsIrregular =
      routeFilters.category === 'verb' ? routeFilters.isIrregular : undefined;

    const nextIsIrregular =
      category === 'verb' ? verbType === 'irregular' : undefined;

    const hasChanged =
      normalizedKeyword !== currentKeyword ||
      category !== currentCategory ||
      nextIsIrregular !== currentIsIrregular ||
      sort !== currentSort ||
      progress !== currentProgress;

    if (!hasChanged) return;

    const nextPath = buildWordsPath(basePath, {
      category,
      isIrregular: nextIsIrregular,
      page: 1,
      sort: effectiveSort,
      progress: effectiveProgress,
    });

    const nextParams = new URLSearchParams();

    if (normalizedKeyword) {
      nextParams.set('keyword', normalizedKeyword);
    }

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${nextPath}?${nextQuery}` : nextPath;

    router.replace(nextUrl, { scroll: false });
  }, [
    basePath,
    category,
    effectiveProgress,
    effectiveSort,
    normalizedKeyword,
    progress,
    routeFilters.category,
    routeFilters.isIrregular,
    routeFilters.progress,
    routeFilters.sort,
    router,
    searchParams,
    sort,
    verbType,
  ]);

  const resetFilters = useCallback(() => {
    setKeyword('');
    setCategory('categories');
    setVerbType('regular');
    setProgress('progress');

    const nextPath = buildWordsPath(basePath, {
      category: 'categories',
      isIrregular: undefined,
      page: 1,
      sort: effectiveSort,
      progress: undefined,
    });

    router.replace(nextPath, { scroll: false });
  }, [basePath, effectiveSort, router]);

  const categoryOptions = useMemo(
    () => [
      { value: 'categories', label: 'Categories' },
      ...categories.map((item) => ({
        value: item,
        label: item
          .split(' ')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
      })),
    ],
    [categories]
  );

  return {
    keyword,
    setKeyword,

    category,
    setCategory,

    verbType,
    setVerbType,

    sort,
    setSort,

    progress,
    setProgress,

    isVerb,
    hasAppliedSort,
    hasAppliedCategory,
    hasAppliedProgress,
    hasAppliedVerbType,
    hasAppliedFilters,
    activeFiltersCount,
    resetFilters,

    categoryOptions,
    verbOptions,
    sortOptions,
    progressOptions,
  };
}
