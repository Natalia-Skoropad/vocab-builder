'use client';

import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import { Plus, ArrowRight, SlidersHorizontal } from 'lucide-react';

import { ROUTES } from '@/lib/constants/routes';

import Filters from '@/components/dashboard/Filters/Filters';
import Statistics from '@/components/dashboard/Statistics/Statistics';

import css from './Dashboard.module.css';

//===============================================================

type Props = {
  variant: 'dictionary' | 'recommend';
  totalCount?: number;
  learnedCount?: number;
  useFallbackStatistics?: boolean;
  showAddWord?: boolean;
  showTrainLink?: boolean;
  onAddWord?: () => void;
  className?: string;
};

//===============================================================

function Dashboard({
  variant,
  totalCount,
  learnedCount,
  useFallbackStatistics = true,
  showAddWord = false,
  showTrainLink = true,
  onAddWord,
  className,
}: Props) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  return (
    <div className={clsx(css.dashboard, className)}>
      <div className={css.topRow}>
        <div className={css.filtersWrap}>
          <Filters
            variant={variant}
            isPanelOpen={isFiltersOpen}
            onOpenPanel={() => setIsFiltersOpen(true)}
            onClosePanel={() => setIsFiltersOpen(false)}
            onAppliedStateChange={setHasAppliedFilters}
          />
        </div>

        <button
          type="button"
          className={clsx(
            css.filterButton,
            hasAppliedFilters && css.filterButtonActive
          )}
          onClick={() => setIsFiltersOpen(true)}
          aria-label="Open filters"
          aria-expanded={isFiltersOpen}
          aria-controls="words-filters-offcanvas"
        >
          <SlidersHorizontal
            className={css.filterButtonIcon}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className={css.metaRow}>
        <div className={css.statisticsWrap}>
          <Statistics
            totalCount={totalCount}
            learnedCount={learnedCount}
            useFallbackQueries={useFallbackStatistics}
          />
        </div>

        <div className={css.actionsWrap}>
          {showAddWord ? (
            <button
              type="button"
              className={clsx(
                css.actionButton,
                'interactive-underline-trigger'
              )}
              onClick={onAddWord}
              aria-label="Add word"
            >
              <span className={clsx(css.actionText, 'interactive-underline')}>
                Add word
              </span>
              <Plus className={css.actionIcon} aria-hidden="true" />
            </button>
          ) : null}

          {showTrainLink ? (
            <Link
              href={ROUTES.TRAINING}
              className={clsx(css.actionLink, 'interactive-underline-trigger')}
            >
              <span className={clsx(css.actionText, 'interactive-underline')}>
                Train oneself
              </span>
              <ArrowRight className={css.actionIcon} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
