'use client';

import { useQuery } from '@tanstack/react-query';

import { wordsService } from '@/lib/services/words.service';

import css from './Statistics.module.css';

//===============================================================

type Props = {
  totalCount?: number;
};

//===============================================================

function Statistics({ totalCount = 0 }: Props) {
  const { data } = useQuery({
    queryKey: ['words-statistics'],
    queryFn: wordsService.getStatistics,
  });

  const value = data?.totalCount ?? totalCount;

  return (
    <p className={css.statistics}>
      <span className={css.label}>To study:</span>{' '}
      <span className={css.value}>{value}</span>
    </p>
  );
}

export default Statistics;
