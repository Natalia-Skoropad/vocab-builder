'use client';

import { useId } from 'react';
import { Search } from 'lucide-react';

import { useWordsFiltersState } from '@/hooks/useWordsFiltersState';

import WordsFiltersDesktop from '@/components/dashboard/Filters/WordsFiltersDesktop';
import WordsFiltersPanel from '@/components/dashboard/Filters/WordsFiltersPanel';

import css from './Filters.module.css';

//===============================================================

type Props = {
  variant: 'dictionary' | 'recommend';
  isPanelOpen: boolean;
  onClosePanel: () => void;
  onAppliedStateChange?: (value: boolean, count: number) => void;
};

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

  const {
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
    activeFiltersCount,
    resetFilters,
    categoryOptions,
    verbOptions,
    sortOptions,
    progressOptions,
  } = useWordsFiltersState({
    variant,
    onAppliedStateChange,
  });

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

        <WordsFiltersDesktop
          category={category}
          sort={sort}
          progress={progress}
          verbType={verbType}
          isVerb={isVerb}
          hasAppliedSort={hasAppliedSort}
          hasAppliedCategory={hasAppliedCategory}
          hasAppliedProgress={hasAppliedProgress}
          activeFiltersCount={activeFiltersCount}
          categoryOptions={categoryOptions}
          sortOptions={sortOptions}
          progressOptions={progressOptions}
          verbOptions={verbOptions}
          onCategoryChange={setCategory}
          onSortChange={setSort}
          onProgressChange={setProgress}
          onVerbTypeChange={setVerbType}
          onResetFilters={resetFilters}
        />
      </div>

      <WordsFiltersPanel
        isOpen={isPanelOpen}
        variant={variant}
        category={category}
        sort={sort}
        progress={progress}
        verbType={verbType}
        isVerb={isVerb}
        hasAppliedSort={hasAppliedSort}
        hasAppliedCategory={hasAppliedCategory}
        hasAppliedProgress={hasAppliedProgress}
        activeFiltersCount={activeFiltersCount}
        categoryOptions={categoryOptions}
        sortOptions={sortOptions}
        progressOptions={progressOptions}
        verbOptions={verbOptions}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onProgressChange={setProgress}
        onVerbTypeChange={setVerbType}
        onResetFilters={resetFilters}
        onClose={onClosePanel}
        sortLabelId={sortLabelId}
        progressLabelId={progressLabelId}
        categoryLabelId={categoryLabelId}
        sortButtonId={sortButtonId}
        progressButtonId={progressButtonId}
        categoryButtonId={categoryButtonId}
        sortMenuId={sortMenuId}
        progressMenuId={progressMenuId}
        categoryMenuId={categoryMenuId}
      />
    </>
  );
}

export default Filters;
