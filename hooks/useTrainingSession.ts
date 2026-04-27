'use client';

import { useCallback, useMemo, useState } from 'react';

import type { TrainingAnswer, TrainingTask } from '@/types/training';

//===============================================================

type TrainingSessionState = {
  tasksKey: string;
  currentIndex: number;
  currentAnswer: string;
  answers: TrainingAnswer[];
};

//===============================================================

function upsertAnswer(
  prev: TrainingAnswer[],
  nextAnswer: TrainingAnswer | null
): TrainingAnswer[] {
  if (!nextAnswer) return prev;

  const existingIndex = prev.findIndex(
    (item) => item._id === nextAnswer._id && item.task === nextAnswer.task
  );

  if (existingIndex === -1) {
    return [...prev, nextAnswer];
  }

  const next = [...prev];
  next[existingIndex] = nextAnswer;

  return next;
}

function buildTasksKey(tasks: TrainingTask[]) {
  return tasks
    .map((task) => `${task._id}:${task.task}:${task.en ?? ''}:${task.ua ?? ''}`)
    .join('|');
}

function createInitialState(tasksKey: string): TrainingSessionState {
  return {
    tasksKey,
    currentIndex: 0,
    currentAnswer: '',
    answers: [],
  };
}

function getSyncedState(
  state: TrainingSessionState,
  tasksKey: string
): TrainingSessionState {
  if (state.tasksKey === tasksKey) return state;

  return createInitialState(tasksKey);
}

//===============================================================

export function useTrainingSession(tasks: TrainingTask[]) {
  const tasksKey = useMemo(() => buildTasksKey(tasks), [tasks]);

  const [state, setState] = useState<TrainingSessionState>(() =>
    createInitialState(tasksKey)
  );

  const syncedState = getSyncedState(state, tasksKey);

  const currentTask = tasks[syncedState.currentIndex];
  const isLastTask = syncedState.currentIndex === tasks.length - 1;

  const buildTrainingAnswer = useCallback(
    (
      task: TrainingTask | undefined = currentTask,
      answer: string = syncedState.currentAnswer
    ): TrainingAnswer | null => {
      if (!task) return null;

      const trimmedAnswer = answer.trim();

      if (!trimmedAnswer) return null;

      if (task.task === 'en') {
        return {
          _id: task._id,
          en: trimmedAnswer,
          ua: task.ua ?? '',
          task: task.task,
        };
      }

      return {
        _id: task._id,
        en: task.en ?? '',
        ua: trimmedAnswer,
        task: task.task,
      };
    },
    [currentTask, syncedState.currentAnswer]
  );

  const setCurrentAnswer = useCallback(
    (value: string) => {
      setState((prev) => ({
        ...getSyncedState(prev, tasksKey),
        currentAnswer: value,
      }));
    },
    [tasksKey]
  );

  const buildSubmitPayload = useCallback((): TrainingAnswer[] => {
    const lastAnswer = buildTrainingAnswer();

    return upsertAnswer(syncedState.answers, lastAnswer);
  }, [buildTrainingAnswer, syncedState.answers]);

  const goToNextTask = useCallback(() => {
    setState((prev) => {
      const baseState = getSyncedState(prev, tasksKey);
      const task = tasks[baseState.currentIndex];
      const lastTask = baseState.currentIndex === tasks.length - 1;

      if (!task || lastTask) return baseState;

      const nextAnswer = buildTrainingAnswer(task, baseState.currentAnswer);

      return {
        ...baseState,
        answers: upsertAnswer(baseState.answers, nextAnswer),
        currentAnswer: '',
        currentIndex: baseState.currentIndex + 1,
      };
    });
  }, [buildTrainingAnswer, tasks, tasksKey]);

  const applySubmittedPayload = useCallback(
    (payload: TrainingAnswer[]) => {
      setState((prev) => ({
        ...getSyncedState(prev, tasksKey),
        answers: payload,
      }));
    },
    [tasksKey]
  );

  const progressCount = syncedState.answers.length;

  return {
    currentIndex: syncedState.currentIndex,
    currentTask,
    currentAnswer: syncedState.currentAnswer,
    setCurrentAnswer,
    answers: syncedState.answers,
    progressCount,
    isLastTask,
    buildTrainingAnswer,
    buildSubmitPayload,
    goToNextTask,
    applySubmittedPayload,
  };
}
