export type WordsAction =
  | 'categories'
  | 'create'
  | 'delete'
  | 'edit'
  | 'own'
  | 'statistics';

//===============================================================

type WordsErrorConfig = {
  status: number;
  message: string;
};

//===============================================================

const WORDS_ERROR_MAP: Record<WordsAction, WordsErrorConfig[]> = {
  categories: [
    { status: 401, message: 'Unauthorized.' },
    { status: 404, message: 'Service not found.' },
    { status: 500, message: 'Failed to fetch categories.' },
  ],

  create: [
    { status: 400, message: 'Bad request (invalid request body).' },
    { status: 401, message: 'Such a word exists.' },
    { status: 404, message: 'Service not found.' },
    { status: 500, message: 'Server error.' },
  ],

  delete: [
    { status: 400, message: 'Bad request (invalid request body).' },
    { status: 401, message: 'This word not found.' },
    { status: 404, message: 'Service not found.' },
    { status: 500, message: 'Server error.' },
  ],

  edit: [
    { status: 400, message: 'Bad request (invalid request body).' },
    { status: 401, message: 'This word not found.' },
    { status: 403, message: "You don't have right to edit this word." },
    { status: 404, message: 'Service not found.' },
    { status: 500, message: 'Server error.' },
  ],

  own: [
    { status: 401, message: 'Unauthorized.' },
    { status: 404, message: 'Service not found.' },
    { status: 500, message: 'Failed to fetch user words.' },
  ],

  statistics: [
    { status: 401, message: 'Unauthorized.' },
    { status: 404, message: 'Service not found.' },
    { status: 500, message: 'Failed to fetch statistics.' },
  ],
};

//===============================================================

export function getWordsErrorMessage(
  action: WordsAction,
  status: number,
  fallback?: string
): string {
  const matched = WORDS_ERROR_MAP[action].find(
    (item) => item.status === status
  );

  if (matched) return matched.message;

  return fallback || 'Something went wrong.';
}
