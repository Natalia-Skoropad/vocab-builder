'use client';

import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

import { wordsService } from '@/lib/services/words.service';

import css from './Statistics.module.css';

//===============================================================

type Props = {
  totalCount?: number;
  className?: string;
};

//===============================================================

function Statistics({ totalCount = 0, className }: Props) {
  const { data } = useQuery({
    queryKey: ['words-statistics'],
    queryFn: wordsService.getStatistics,
  });

  const { data: ownWordsData } = useQuery({
    queryKey: ['words-learned-statistics'],
    queryFn: () =>
      wordsService.getOwnWords({
        page: 1,
        limit: 1000,
      }),
  });

  const toStudyValue = data?.totalCount ?? totalCount;

  const learnedValue =
    ownWordsData?.results.filter((word) => {
      const progress =
        typeof word.progress === 'number'
          ? word.progress
          : Number(word.progress) || 0;

      return progress >= 100;
    }).length ?? 0;

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
