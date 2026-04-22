import type { WordsQueryParams } from '@/types/word';
import type { WordProgressFilter } from '@/lib/utils/dictionary.query';

//===============================================================

export const wordsQueryKeys = {
  dictionaryRoot: ['dictionary-words'] as const,
  recommendRoot: ['recommend-words'] as const,
  statistics: ['words-statistics'] as const,
  learnedCount: ['words-learned-count'] as const,
  recommendOwn: ['recommend-own-words'] as const,

  dictionary: (params: WordsQueryParams, progress?: WordProgressFilter) =>
    [...wordsQueryKeys.dictionaryRoot, params, progress] as const,

  recommend: (params: WordsQueryParams, progress?: WordProgressFilter) =>
    [...wordsQueryKeys.recommendRoot, params, progress] as const,
};
