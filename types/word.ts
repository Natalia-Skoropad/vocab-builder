import type { PaginatedResponse } from '@/types/pagination';

//===============================================================

export type WordCategory =
  | 'verb'
  | 'participle'
  | 'noun'
  | 'adjective'
  | 'pronoun'
  | 'numerals'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'phrasal verb'
  | 'functional phrase';

export type WordSort = 'a-z' | 'z-a';

//===============================================================

export type BaseWordItem = {
  _id: string;
  en: string;
  ua: string;
  category: WordCategory;
  isIrregular?: boolean;
};

export type WordItem = BaseWordItem & {
  owner?: string;
  progress: number;
};

export type RecommendedWordItem = BaseWordItem & {
  owner?: string;
  progress?: number;
};

//===============================================================

export type OwnWordsResponse = PaginatedResponse<WordItem>;
export type RecommendedWordsResponse = PaginatedResponse<RecommendedWordItem>;

//===============================================================

export type WordsResponse = OwnWordsResponse;

export type WordsQueryParams = {
  keyword?: string;
  category?: string;
  isIrregular?: boolean;
  page?: number;
  limit?: number;
  sort?: WordSort;
  newWordId?: string;
};
