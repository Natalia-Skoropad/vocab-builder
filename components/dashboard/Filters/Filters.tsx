'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { useDebounce } from '@/hooks/useDebounce';
import { useCategoriesStore } from '@/store/categories/categoriesStore';
import {
  buildDictionaryPath,
  parseDictionarySegments,
} from '@/lib/utils/dictionary.query';

import css from './Filters.module.css';

//===============================================================

type Props = {
  variant: 'dictionary' | 'recommend';
};

//===============================================================

function Filters({ variant }: Props) {
  const searchId = useId();
  const categoryId = useId();

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ filters?: string[] | string }>();
  const searchParams = useSearchParams();

  const categories = useCategoriesStore((state) => state.categories);
  const isLoaded = useCategoriesStore((state) => state.isLoaded);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const rawFiltersParam = params.filters;

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

  const normalizedKeyword = useMemo(
    () => debouncedKeyword.trim(),
    [debouncedKeyword]
  );

  const derivedCategory = routeFilters.category;

  const effectiveCategory =
    category !== derivedCategory ? category : derivedCategory;
  const effectiveVerbType = effectiveCategory === 'verb' ? verbType : 'regular';
  const isVerb = effectiveCategory === 'verb';
  const effectiveIsIrregular = isVerb
    ? effectiveVerbType === 'irregular'
    : undefined;

  useEffect(() => {
    const nextPath = buildDictionaryPath({
      category: effectiveCategory,
      isIrregular: effectiveIsIrregular,
      page: 1,
    });

    const nextParams = new URLSearchParams();

    if (normalizedKeyword) {
      nextParams.set('keyword', normalizedKeyword);
    }

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${nextPath}?${nextQuery}` : nextPath;
    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [
    effectiveCategory,
    effectiveIsIrregular,
    normalizedKeyword,
    pathname,
    router,
    searchParams,
  ]);

  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

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

          <select
            id={categoryId}
            value={effectiveCategory}
            onChange={(event) =>
              setCategory(event.target.value as typeof effectiveCategory)
            }
            className={css.select}
          >
            <option value="categories">Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item
                  .split(' ')
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isVerb ? (
        <fieldset className={css.radioGroup}>
          <legend className="visually-hidden">Verb type</legend>

          <label className={css.radioLabel}>
            <input
              type="radio"
              name={`verb-type-${variant}`}
              value="regular"
              checked={effectiveVerbType === 'regular'}
              onChange={() => setVerbType('regular')}
              className={css.radioInput}
            />
            <span>Regular</span>
          </label>

          <label className={css.radioLabel}>
            <input
              type="radio"
              name={`verb-type-${variant}`}
              value="irregular"
              checked={effectiveVerbType === 'irregular'}
              onChange={() => setVerbType('irregular')}
              className={css.radioInput}
            />
            <span>Irregular</span>
          </label>
        </fieldset>
      ) : null}
    </div>
  );
}

export default Filters;
