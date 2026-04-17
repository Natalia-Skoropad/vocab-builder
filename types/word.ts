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

export type WordItem = {
  _id: string;
  en: string;
  ua: string;
  category: WordCategory;
  isIrregular?: boolean;
  owner?: string;
  progress: number;
};

//===============================================================

export type WordsResponse = PaginatedResponse<WordItem>;

export type WordsQueryParams = {
  keyword?: string;
  category?: string;
  isIrregular?: boolean;
  page?: number;
  limit?: number;
  sort?: WordSort;
  newWordId?: string;
};

//===============================================================

export type TrainingTaskItem = {
  _id: string;
  en?: string;
  ua?: string;
  task: 'en' | 'ua';
};

export type TrainingTasksResponse = {
  words: TrainingTaskItem[];
};
