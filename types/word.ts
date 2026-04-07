export type WordCategory =
  | 'verb'
  | 'noun'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'participle'
  | 'preposition'
  | 'pronoun';

export type Word = {
  id: string;
  en: string;
  ua: string;
  category: WordCategory;
  isIrregular?: boolean;
  progress?: number;
};
