'use client';

import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

import { wordsService } from '@/lib/services/words.service';
import { wordsQueryKeys } from '@/lib/words/query-keys';

import css from './Statistics.module.css';

//===============================================================

type Props = {
  totalCount?: number;
  learnedCount?: number;
  className?: string;
  useFallbackLearnedCount?: boolean;
};

//===============================================================

function Statistics({
  totalCount,
  learnedCount,
  className,
  useFallbackLearnedCount = false,
}: Props) {
  const shouldFetchTotalCount = typeof totalCount !== 'number';

  const shouldFetchLearnedCountFallback =
    useFallbackLearnedCount && typeof learnedCount !== 'number';

  const { data: statisticsData } = useQuery({
    queryKey: wordsQueryKeys.statistics,
    queryFn: wordsService.getStatistics,
    enabled: shouldFetchTotalCount,
    staleTime: 60_000,
  });

  const { data: fallbackLearnedCount } = useQuery({
    queryKey: wordsQueryKeys.learnedCountFallback,
    queryFn: wordsService.getLearnedWordsCountFallback,
    enabled: shouldFetchLearnedCountFallback,
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
