'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useDebounce } from '@/hooks/useDebounce';
import { useCategoriesStore } from '@/store/categories/categoriesStore';

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
  const searchParams = useSearchParams();

  const categories = useCategoriesStore((state) => state.categories);
  const isLoaded = useCategoriesStore((state) => state.isLoaded);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const initialKeyword = searchParams.get('keyword') ?? '';
  const initialCategory = searchParams.get('category') ?? 'categories';
  const initialIsIrregular = searchParams.get('isIrregular');

  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [verbType, setVerbType] = useState<'regular' | 'irregular'>(
    initialIsIrregular === 'true' ? 'irregular' : 'regular'
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

  const isVerb = category === 'verb';
  const effectiveVerbType = isVerb ? verbType : 'regular';

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (normalizedKeyword) {
      params.set('keyword', normalizedKeyword);
    } else {
      params.delete('keyword');
    }

    if (category && category !== 'categories') {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    if (category === 'verb') {
      params.set('isIrregular', String(effectiveVerbType === 'irregular'));
    } else {
      params.delete('isIrregular');
    }

    params.set('page', '1');

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }
  }, [
    normalizedKeyword,
    category,
    effectiveVerbType,
    pathname,
    router,
    searchParams,
  ]);

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
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={css.select}
          >
            <option value="categories">Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
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
              checked={verbType === 'regular'}
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
              checked={verbType === 'irregular'}
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
