'use client';

import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

import { wordsService } from '@/lib/services/words.service';

import css from './Statistics.module.css';

//===============================================================

type Props = {
  totalCount?: number;
  learnedCount?: number;
  className?: string;
  useFallbackQueries?: boolean;
};

//===============================================================

function Statistics({
  totalCount,
  learnedCount,
  className,
  useFallbackQueries = true,
}: Props) {
  const shouldFetchTotalCount =
    useFallbackQueries && typeof totalCount !== 'number';

  const shouldFetchLearnedCount =
    useFallbackQueries && typeof learnedCount !== 'number';

  const { data: statisticsData } = useQuery({
    queryKey: ['words-statistics'],
    queryFn: wordsService.getStatistics,
    enabled: shouldFetchTotalCount,
    staleTime: 60_000,
  });

  const { data: fallbackLearnedCount } = useQuery({
    queryKey: ['words-learned-count'],
    queryFn: wordsService.getLearnedWordsCount,
    enabled: shouldFetchLearnedCount,
    staleTime: 60_000,
  });

  const toStudyValue = totalCount ?? statisticsData?.totalCount ?? 0;
  const learnedValue = learnedCount ?? fallbackLearnedCount ?? 0;

  return (
    <div className={clsx(css.statisticsWrap, className)}>
      <p className={css.statistics}>
        <span className={css.label}>To study:</span>
        <span className={css.value}>{toStudyValue}</span>
      </p>

      <p className={css.statistics}>
        <span className={css.label}>Words learned:</span>
        <span className={css.value}>{learnedValue}</span>
      </p>
    </div>
  );
}

export default Statistics;
