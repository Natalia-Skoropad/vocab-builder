'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import type { WordSort } from '@/types/word';
import { useDebounce } from '@/hooks/useDebounce';
import { useCategoriesStore } from '@/store/categories/categoriesStore';

import {
  buildWordsPath,
  parseDictionarySegments,
} from '@/lib/utils/dictionary.query';

import CustomSelect from '@/components/common/CustomSelect/CustomSelect';
import RadioGroup, {
  type RadioOption,
} from '@/components/common/RadioGroup/RadioGroup';

import css from './Filters.module.css';

//===============================================================

type Props = {
  variant: 'dictionary' | 'recommend';
};

type SortValue = 'sort' | WordSort;

const verbOptions: RadioOption[] = [
  { value: 'regular', label: 'Regular' },
  { value: 'irregular', label: 'Irregular' },
];

const sortOptions = [
  { value: 'sort', label: 'Sort' },
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
];

//===============================================================

function Filters({ variant }: Props) {
  const searchId = useId();
  const categoryId = useId();
  const sortId = useId();

  const router = useRouter();
  const params = useParams<{ filters?: string[] | string }>();
  const searchParams = useSearchParams();

  const categories = useCategoriesStore((state) => state.categories);
  const isLoaded = useCategoriesStore((state) => state.isLoaded);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const rawFiltersParam = params.filters;
  const basePath = variant === 'recommend' ? '/recommend' : '/dictionary';

  const routeSegments = useMemo<string[]>(() => {
    if (Array.isArray(rawFiltersParam)) {
      return rawFiltersParam;
    }

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

  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    if (isLoaded) return;

    void fetchCategories().catch((error) => {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to load categories.'
      );
    });
  }, [fetchCategories, isLoaded]);

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

  const normalizedKeyword = useMemo(
    () => debouncedKeyword.trim(),
    [debouncedKeyword]
  );

  const isVerb = category === 'verb';
  const effectiveSort = sort === 'sort' ? undefined : sort;

  useEffect(() => {
    const currentKeyword = searchParams.get('keyword')?.trim() ?? '';
    const currentSort = routeFilters.sort ?? 'sort';
    const currentCategory = routeFilters.category;
    const currentIsIrregular =
      routeFilters.category === 'verb' ? routeFilters.isIrregular : undefined;

    const nextIsIrregular =
      category === 'verb' ? verbType === 'irregular' : undefined;

    const hasChanged =
      normalizedKeyword !== currentKeyword ||
      category !== currentCategory ||
      nextIsIrregular !== currentIsIrregular ||
      sort !== currentSort;

    if (!hasChanged) {
      return;
    }

    const nextPath = buildWordsPath(basePath, {
      category,
      isIrregular: nextIsIrregular,
      page: 1,
      sort: effectiveSort,
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
    effectiveSort,
    normalizedKeyword,
    routeFilters.category,
    routeFilters.isIrregular,
    routeFilters.sort,
    router,
    searchParams,
    sort,
    verbType,
  ]);

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

  return (
    <div className={css.filters}>
      <div className={css.topRow}>
        <div className={css.searchWrap}>
          <label htmlFor={searchId} className="visually-hidden">
            Find the word
          </label>

          <input
            id={searchId}
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Find the word"
            className={css.searchInput}
          />

          <Search className={css.searchIcon} aria-hidden="true" />
        </div>

        <div className={css.selectWrap}>
          <label htmlFor={categoryId} className="visually-hidden">
            Select category
          </label>

          <div id={categoryId}>
            <CustomSelect
              value={category}
              options={categoryOptions}
              onChange={(nextValue) =>
                setCategory(nextValue as typeof category)
              }
              placeholder="Categories"
            />
          </div>
        </div>

        <div className={css.sortWrap}>
          <label htmlFor={sortId} className="visually-hidden">
            Sort words
          </label>

          <div id={sortId}>
            <CustomSelect
              value={sort}
              options={sortOptions}
              onChange={(nextValue) => setSort(nextValue as SortValue)}
              placeholder="Sort"
            />
          </div>
        </div>
      </div>

      {isVerb ? (
        <RadioGroup
          name={`verb-type-${variant}`}
          value={verbType}
          options={verbOptions}
          onChange={(nextValue) =>
            setVerbType(nextValue as 'regular' | 'irregular')
          }
          className={css.radioGroup}
          ariaLabel="Verb type"
        />
      ) : null}
    </div>
  );
}

export default Filters;
