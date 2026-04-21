'use client';

import { useCallback, useMemo, useState } from 'react';

import type { TrainingAnswer, TrainingTask } from '@/types/training';

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

//===============================================================

export function useTrainingSession(tasks: TrainingTask[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<TrainingAnswer[]>([]);

  const currentTask = tasks[currentIndex];
  const isLastTask = currentIndex === tasks.length - 1;

  const buildTrainingAnswer = useCallback((): TrainingAnswer | null => {
    if (!currentTask) return null;

    const trimmedAnswer = currentAnswer.trim();

    if (!trimmedAnswer) return null;

    if (currentTask.task === 'en') {
      return {
        _id: currentTask._id,
        en: trimmedAnswer,
        ua: currentTask.ua ?? '',
        task: currentTask.task,
      };
    }

    return {
      _id: currentTask._id,
      en: currentTask.en ?? '',
      ua: trimmedAnswer,
      task: currentTask.task,
    };
  }, [currentAnswer, currentTask]);

  const buildSubmitPayload = useCallback((): TrainingAnswer[] => {
    const lastAnswer = buildTrainingAnswer();
    return upsertAnswer(answers, lastAnswer);
  }, [answers, buildTrainingAnswer]);

  const goToNextTask = useCallback(() => {
    if (!currentTask || isLastTask) return;

    const nextAnswer = buildTrainingAnswer();

    setAnswers((prev) => upsertAnswer(prev, nextAnswer));
    setCurrentAnswer('');
    setCurrentIndex((prev) => prev + 1);
  }, [buildTrainingAnswer, currentTask, isLastTask]);

  const applySubmittedPayload = useCallback((payload: TrainingAnswer[]) => {
    setAnswers(payload);
  }, []);

  const progressCount = useMemo(() => answers.length, [answers.length]);

  return {
    currentIndex,
    currentTask,
    currentAnswer,
    setCurrentAnswer,
    answers,
    progressCount,
    isLastTask,
    buildTrainingAnswer,
    buildSubmitPayload,
    goToNextTask,
    applySubmittedPayload,
  };
}
