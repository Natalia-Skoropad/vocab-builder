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
};

//===============================================================

function getLearnedWordsCountFromResults(
  results: Array<{ progress: number | string }>
): number {
  return results.filter((word) => {
    const progress =
      typeof word.progress === 'number'
        ? word.progress
        : Number(word.progress) || 0;

    return progress >= 100;
  }).length;
}

//===============================================================

function Statistics({ totalCount = 0, learnedCount, className }: Props) {
  const { data: statisticsData } = useQuery({
    queryKey: ['words-statistics'],
    queryFn: wordsService.getStatistics,
  });

  const shouldFetchLearnedCount = typeof learnedCount !== 'number';

  const { data: learnedWordsCount = 0 } = useQuery({
    queryKey: ['words-learned-count'],
    queryFn: async () => {
      const response = await wordsService.getOwnWords({
        page: 1,
        limit: 1000,
      });

      return getLearnedWordsCountFromResults(response.results);
    },
    enabled: shouldFetchLearnedCount,
    staleTime: 60_000,
  });

  const toStudyValue = statisticsData?.totalCount ?? totalCount;

  const learnedValue =
    typeof learnedCount === 'number' ? learnedCount : learnedWordsCount;

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
