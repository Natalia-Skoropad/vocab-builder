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

export type WordItem = {
  _id: string;
  en: string;
  ua: string;
  category: WordCategory;
  isIrregular?: boolean;
  owner?: string;
  progress: number;
};

export type WordsResponse = PaginatedResponse<WordItem>;
