'use client';

import Image from 'next/image';
import { useEffect, useId, useMemo, useCallback, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import type { WordSort } from '@/types/word';
import { useDebounce } from '@/hooks/useDebounce';
import { useCategoriesStore } from '@/store/categories/categoriesStore';

import {
  buildWordsPath,
  parseDictionarySegments,
  type WordProgressFilter,
} from '@/lib/utils/dictionary.query';

import CustomSelect from '@/components/common/CustomSelect/CustomSelect';
import CloseButton from '@/components/common/CloseButton/CloseButton';

import RadioGroup, {
  type RadioOption,
} from '@/components/common/RadioGroup/RadioGroup';

import css from './Filters.module.css';

//===============================================================

type Props = {
  variant: 'dictionary' | 'recommend';
  isPanelOpen: boolean;
  onOpenPanel: () => void;
  onClosePanel: () => void;
  onAppliedStateChange?: (value: boolean) => void;
};

type SortValue = 'sort' | WordSort;
type ProgressValue = 'progress' | WordProgressFilter;

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

function Filters({
  variant,
  isPanelOpen,
  onClosePanel,
  onAppliedStateChange,
}: Props) {
  const searchId = useId();

  const sortLabelId = useId();
  const progressLabelId = useId();
  const categoryLabelId = useId();

  const sortButtonId = useId();
  const progressButtonId = useId();
  const categoryButtonId = useId();

  const sortMenuId = useId();
  const progressMenuId = useId();
  const categoryMenuId = useId();

  const router = useRouter();
  const params = useParams<{ filters?: string[] | string }>();
  const searchParams = useSearchParams();

  const categories = useCategoriesStore((state) => state.categories);
  const isLoaded = useCategoriesStore((state) => state.isLoaded);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

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
  const hasAppliedFilters =
    hasAppliedSort || hasAppliedCategory || hasAppliedProgress;

  useEffect(() => {
    onAppliedStateChange?.(hasAppliedFilters);
  }, [hasAppliedFilters, onAppliedStateChange]);

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

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClosePanel();
      }
    },
    [onClosePanel]
  );

  useEffect(() => {
    if (!isPanelOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClosePanel();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPanelOpen, onClosePanel]);

  return (
    <>
      <div className={css.filters}>
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

        <div className={css.desktopControls}>
          <div className={css.sortWrap}>
            <CustomSelect
              value={sort}
              options={sortOptions}
              onChange={(nextValue) => setSort(nextValue as SortValue)}
              placeholder="Sort"
              isActive={hasAppliedSort}
              ariaLabel="Sort words"
            />
          </div>

          <div className={css.progressWrap}>
            <CustomSelect
              value={progress}
              options={progressOptions}
              onChange={(nextValue) => setProgress(nextValue as ProgressValue)}
              placeholder="Progress"
              isActive={hasAppliedProgress}
              ariaLabel="Filter by progress"
            />
          </div>

          <div className={css.selectWrap}>
            <CustomSelect
              value={category}
              options={categoryOptions}
              onChange={(nextValue) =>
                setCategory(nextValue as typeof category)
              }
              placeholder="Categories"
              isActive={hasAppliedCategory}
              ariaLabel="Filter by category"
            />
          </div>

          {isVerb ? (
            <RadioGroup
              name={`verb-type-desktop-${variant}`}
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
      </div>

      {isPanelOpen ? (
        <div
          className={css.backdrop}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Filters panel"
        >
          <div id="words-filters-offcanvas" className={css.panel}>
            <div className={css.panelTopRow}>
              <h2 className={css.panelTitle}>Filters</h2>
              <CloseButton onClick={onClosePanel} />
            </div>

            <div className={css.panelContent}>
              <div className={css.panelField}>
                <span id={sortLabelId} className={css.panelLabel}>
                  Sort
                </span>

                <CustomSelect
                  value={sort}
                  options={sortOptions}
                  onChange={(nextValue) => setSort(nextValue as SortValue)}
                  placeholder="Sort"
                  variant="modal"
                  isActive={hasAppliedSort}
                  buttonId={sortButtonId}
                  menuId={sortMenuId}
                  ariaLabelledBy={sortLabelId}
                />
              </div>

              <div className={css.panelField}>
                <span id={progressLabelId} className={css.panelLabel}>
                  Progress
                </span>

                <CustomSelect
                  value={progress}
                  options={progressOptions}
                  onChange={(nextValue) =>
                    setProgress(nextValue as ProgressValue)
                  }
                  placeholder="Progress"
                  variant="modal"
                  isActive={hasAppliedProgress}
                  buttonId={progressButtonId}
                  menuId={progressMenuId}
                  ariaLabelledBy={progressLabelId}
                />
              </div>

              <div className={css.panelField}>
                <span id={categoryLabelId} className={css.panelLabel}>
                  Category
                </span>

                <CustomSelect
                  value={category}
                  options={categoryOptions}
                  onChange={(nextValue) =>
                    setCategory(nextValue as typeof category)
                  }
                  placeholder="Categories"
                  variant="modal"
                  isActive={hasAppliedCategory}
                  buttonId={categoryButtonId}
                  menuId={categoryMenuId}
                  ariaLabelledBy={categoryLabelId}
                />
              </div>

              {isVerb ? (
                <div className={css.panelField}>
                  <RadioGroup
                    name={`verb-type-mobile-${variant}`}
                    value={verbType}
                    options={verbOptions}
                    onChange={(nextValue) =>
                      setVerbType(nextValue as 'regular' | 'irregular')
                    }
                    className={css.modalRadioGroup}
                    variant="light"
                    ariaLabel="Verb type"
                  />
                </div>
              ) : null}
            </div>

            <div className={css.illustrationWrap} aria-hidden="true">
              <Image
                src="/training-empty.png"
                alt=""
                fill
                className={css.illustration}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Filters;
