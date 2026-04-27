'use client';

import type { WordCategory } from '@/types/word';
import type { SortValue, ProgressValue } from '@/hooks/useWordsFiltersState';

import CustomSelect from '@/components/common/CustomSelect/CustomSelect';
import ResetFiltersButton from '@/components/common/ResetFiltersButton/ResetFiltersButton';

import RadioGroup, {
  type RadioOption,
} from '@/components/common/RadioGroup/RadioGroup';

import css from './Filters.module.css';

//===============================================================

type Option = {
  value: string;
  label: string;
};

type Props = {
  category: 'categories' | WordCategory;
  sort: SortValue;
  progress: ProgressValue;
  verbType: 'regular' | 'irregular';
  isVerb: boolean;
  hasAppliedSort: boolean;
  hasAppliedCategory: boolean;
  hasAppliedProgress: boolean;
  activeFiltersCount: number;
  categoryOptions: Option[];
  sortOptions: Option[];
  progressOptions: Option[];
  verbOptions: RadioOption[];
  onCategoryChange: (value: 'categories' | WordCategory) => void;
  onSortChange: (value: SortValue) => void;
  onProgressChange: (value: ProgressValue) => void;
  onVerbTypeChange: (value: 'regular' | 'irregular') => void;
  onResetFilters: () => void;
};

//===============================================================

function WordsFiltersDesktop({
  category,
  sort,
  progress,
  verbType,
  isVerb,
  hasAppliedSort,
  hasAppliedCategory,
  hasAppliedProgress,
  activeFiltersCount,
  categoryOptions,
  sortOptions,
  progressOptions,
  verbOptions,
  onCategoryChange,
  onSortChange,
  onProgressChange,
  onVerbTypeChange,
  onResetFilters,
}: Props) {
  return (
    <div className={css.desktopControls}>
      <div className={css.progressWrap}>
        <CustomSelect
          value={progress}
          options={progressOptions}
          onChange={(nextValue) => onProgressChange(nextValue as ProgressValue)}
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
            onCategoryChange(nextValue as 'categories' | WordCategory)
          }
          placeholder="Categories"
          isActive={hasAppliedCategory}
          ariaLabel="Filter by category"
        />
      </div>

      {isVerb ? (
        <RadioGroup
          name="verb-type-desktop"
          value={verbType}
          options={verbOptions}
          onChange={(nextValue) =>
            onVerbTypeChange(nextValue as 'regular' | 'irregular')
          }
          className={css.radioGroup}
          ariaLabel="Verb type"
        />
      ) : null}

      <ResetFiltersButton
        count={activeFiltersCount}
        onClick={onResetFilters}
        className={css.resetButton}
      />

      <div className={css.sortWrap}>
        <CustomSelect
          value={sort}
          options={sortOptions}
          onChange={(nextValue) => onSortChange(nextValue as SortValue)}
          placeholder="Sort"
          isActive={hasAppliedSort}
          ariaLabel="Sort words"
        />
      </div>
    </div>
  );
}

export default WordsFiltersDesktop;
