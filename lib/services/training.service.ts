import type {
  TrainingTask,
  TrainingTasksResponse,
  TrainingSubmitPayload,
  TrainingSubmitResponse,
} from '@/types/training';

import {
  assertTrainingSubmitResponse,
  parseClientJsonSafe,
  throwIfResponseNotOk,
} from '@/lib/api/client-response';

//===============================================================

type ErrorResponse = {
  message?: string;
};

//===============================================================

function isTrainingTaskItem(data: unknown): data is TrainingTask {
  return (
    !!data &&
    typeof data === 'object' &&
    typeof (data as TrainingTask)._id === 'string' &&
    ((data as TrainingTask).task === 'en' ||
      (data as TrainingTask).task === 'ua') &&
    (typeof (data as TrainingTask).en === 'string' ||
      typeof (data as TrainingTask).ua === 'string')
  );
}

function isTrainingTasksResponse(data: unknown): data is TrainingTasksResponse {
  return (
    !!data &&
    typeof data === 'object' &&
    Array.isArray((data as { words?: unknown[] }).words) &&
    (data as { words: unknown[] }).words.every(isTrainingTaskItem)
  );
}

//===============================================================

async function getTasks(): Promise<TrainingTasksResponse> {
  const response = await fetch('/api/training/tasks', {
    method: 'GET',
    cache: 'no-store',
  });

  const data = await parseClientJsonSafe<TrainingTasksResponse | ErrorResponse>(
    response
  );

  throwIfResponseNotOk(response, data, 'Failed to fetch training tasks.');

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

  const data = await parseClientJsonSafe<
    TrainingSubmitResponse | ErrorResponse
  >(response);

  throwIfResponseNotOk(response, data, 'Failed to save training answers.');
  assertTrainingSubmitResponse(data);

  return data;
}

//===============================================================

export const trainingService = {
  getTasks,
  submitAnswers,
};
