import type {
  TrainingTasksResponse,
  TrainingSubmitPayload,
  TrainingSubmitResponse,
} from '@/types/training';

//===============================================================

type ErrorResponse = {
  message?: string;
};

//===============================================================

function isErrorResponse(data: unknown): data is ErrorResponse {
  return !!data && typeof data === 'object' && 'message' in data;
}

function isTrainingTasksResponse(data: unknown): data is TrainingTasksResponse {
  return (
    !!data &&
    typeof data === 'object' &&
    Array.isArray((data as TrainingTasksResponse).tasks)
  );
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

  if (!isTrainingTasksResponse(data)) {
    throw new Error('Invalid training tasks response.');
  }

  return data;
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
