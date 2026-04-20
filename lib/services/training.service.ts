import type {
  TrainingTask,
  TrainingTasksResponse,
  TrainingSubmitPayload,
  TrainingSubmitResponse,
} from '@/types/training';

//===============================================================

type ErrorResponse = {
  message?: string;
};

type RawTrainingTasksResponse =
  | {
      words: TrainingTask[];
    }
  | {
      tasks: TrainingTask[];
    };

//===============================================================

function isErrorResponse(data: unknown): data is ErrorResponse {
  return !!data && typeof data === 'object' && 'message' in data;
}

function isTrainingTaskItem(data: unknown): data is TrainingTask {
  return (
    !!data &&
    typeof data === 'object' &&
    typeof (data as TrainingTask)._id === 'string' &&
    (((data as TrainingTask).task === 'en' &&
      typeof (data as TrainingTask).ua === 'string') ||
      ((data as TrainingTask).task === 'ua' &&
        typeof (data as TrainingTask).en === 'string'))
  );
}

function isRawTrainingTasksResponse(
  data: unknown
): data is RawTrainingTasksResponse {
  return (
    !!data &&
    typeof data === 'object' &&
    (Array.isArray((data as { words?: unknown[] }).words) ||
      Array.isArray((data as { tasks?: unknown[] }).tasks))
  );
}

function normalizeTrainingTasksResponse(
  data: RawTrainingTasksResponse
): TrainingTasksResponse {
  if ('words' in data) {
    return {
      words: data.words,
    };
  }

  return {
    words: data.tasks,
  };
}

function isTrainingSubmitResponse(
  data: unknown
): data is TrainingSubmitResponse {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        !!item &&
        typeof item === 'object' &&
        typeof item._id === 'string' &&
        typeof item.en === 'string' &&
        typeof item.ua === 'string' &&
        (item.task === 'en' || item.task === 'ua') &&
        typeof item.isDone === 'boolean'
    )
  );
}

//===============================================================

async function getTasks(): Promise<TrainingTasksResponse> {
  const response = await fetch('/api/training/tasks', {
    method: 'GET',
    cache: 'no-store',
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      isErrorResponse(data) && typeof data.message === 'string'
        ? data.message
        : 'Failed to fetch training tasks.'
    );
  }

  if (!isRawTrainingTasksResponse(data)) {
    throw new Error('Invalid training tasks response.');
  }

  const normalizedData = normalizeTrainingTasksResponse(data);

  if (!normalizedData.words.every(isTrainingTaskItem)) {
    throw new Error('Invalid training tasks response.');
  }

  return normalizedData;
}

async function submitAnswers(
  payload: TrainingSubmitPayload
): Promise<TrainingSubmitResponse> {
  const response = await fetch('/api/training/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      isErrorResponse(data) && typeof data.message === 'string'
        ? data.message
        : 'Failed to save training answers.'
    );
  }

  if (!isTrainingSubmitResponse(data)) {
    throw new Error('Invalid training submit response.');
  }

  return data;
}

//===============================================================

export const trainingService = {
  getTasks,
  submitAnswers,
};
