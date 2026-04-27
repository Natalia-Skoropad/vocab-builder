'use client';

import Image from 'next/image';

import type { WordCategory } from '@/types/word';
import type { SortValue, ProgressValue } from '@/hooks/useWordsFiltersState';
import { useBackdropClose } from '@/hooks/useBackdropClose';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';

import CloseButton from '@/components/common/CloseButton/CloseButton';
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
  isOpen: boolean;
  variant: 'dictionary' | 'recommend';
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
  onClose: () => void;
  sortLabelId: string;
  progressLabelId: string;
  categoryLabelId: string;
  sortButtonId: string;
  progressButtonId: string;
  categoryButtonId: string;
  sortMenuId: string;
  progressMenuId: string;
  categoryMenuId: string;
};

//===============================================================

function WordsFiltersPanel({
  isOpen,
  variant,
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
  onClose,
  sortLabelId,
  progressLabelId,
  categoryLabelId,
  sortButtonId,
  progressButtonId,
  categoryButtonId,
  sortMenuId,
  progressMenuId,
  categoryMenuId,
}: Props) {
  useEscapeToClose({
    isActive: isOpen,
    onClose,
  });

  const handleBackdropClick = useBackdropClose<HTMLDivElement>(onClose);

  const handleResetFilters = () => {
    onResetFilters();
    onClose();
  };

  if (!isOpen) return null;

  return (
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
          <CloseButton onClick={onClose} />
        </div>

        <div className={css.panelContent}>
          <div className={css.panelField}>
            <span id={sortLabelId} className={css.panelLabel}>
              Sort
            </span>

            <CustomSelect
              value={sort}
              options={sortOptions}
              onChange={(nextValue) => onSortChange(nextValue as SortValue)}
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
                onProgressChange(nextValue as ProgressValue)
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
                onCategoryChange(nextValue as 'categories' | WordCategory)
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
                  onVerbTypeChange(nextValue as 'regular' | 'irregular')
                }
                className={css.modalRadioGroup}
                variant="light"
                ariaLabel="Verb type"
              />
            </div>
          ) : null}

          <ResetFiltersButton
            count={activeFiltersCount}
            onClick={handleResetFilters}
            variant="light"
            className={css.panelResetButton}
          />
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
  );
}

export default WordsFiltersPanel;
