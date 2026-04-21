import type { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { wordsQueryKeys } from '@/lib/words/query-keys';

//===============================================================

export function showMutationSuccessToast(
  message: string | undefined,
  fallbackMessage: string
) {
  toast.success(message || fallbackMessage);
}

export function showMutationErrorToast(
  error: unknown,
  fallbackMessage: string
) {
  toast.error(error instanceof Error ? error.message : fallbackMessage);
}

//===============================================================

export async function invalidateWordsStatisticsQueries(
  queryClient: QueryClient
) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: wordsQueryKeys.statistics,
    }),
    queryClient.invalidateQueries({
      queryKey: wordsQueryKeys.learnedCount,
    }),
  ]);
}

export async function invalidateDictionaryQueries(queryClient: QueryClient) {
  await queryClient.invalidateQueries({
    queryKey: ['dictionary-words'],
  });
}

export async function invalidateRecommendQueries(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ['recommend-words'],
    }),
    queryClient.invalidateQueries({
      queryKey: wordsQueryKeys.recommendOwn,
    }),
  ]);
}

export async function invalidateDictionaryDashboardQueries(
  queryClient: QueryClient
) {
  await Promise.all([
    invalidateDictionaryQueries(queryClient),
    invalidateWordsStatisticsQueries(queryClient),
  ]);
}

export async function invalidateRecommendDashboardQueries(
  queryClient: QueryClient
) {
  await Promise.all([
    invalidateRecommendQueries(queryClient),
    invalidateDictionaryQueries(queryClient),
    invalidateWordsStatisticsQueries(queryClient),
  ]);
}
