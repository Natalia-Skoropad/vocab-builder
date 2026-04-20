'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import type { TrainingAnswer, TrainingSubmitResponse } from '@/types/training';

import { ROUTES } from '@/lib/constants/routes';
import { trainingService } from '@/lib/services/training.service';

import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import InlineLoader from '@/components/common/InlineLoader/InlineLoader';
import Statistics from '@/components/dashboard/Statistics/Statistics';
import WellDoneModal from '@/components/modals/WellDoneModal/WellDoneModal';
import TrainingProgress from '@/components/training/TrainingProgress/TrainingProgress';
import TrainingRoom from '@/components/training/TrainingRoom/TrainingRoom';

import css from './page.module.css';

//===============================================================

function upsertAnswer(
  prev: TrainingAnswer[],
  nextAnswer: TrainingAnswer | null
): TrainingAnswer[] {
  if (!nextAnswer) return prev;

  const existingIndex = prev.findIndex((item) => item._id === nextAnswer._id);

  if (existingIndex === -1) {
    return [...prev, nextAnswer];
  }

  const next = [...prev];
  next[existingIndex] = nextAnswer;

  return next;
}

//===============================================================

function TrainingPageClient() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<TrainingAnswer[]>([]);
  const [isWellDoneOpen, setIsWellDoneOpen] = useState(false);
  const [trainingResult, setTrainingResult] = useState<TrainingSubmitResponse>(
    []
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['training-tasks'],
    queryFn: trainingService.getTasks,
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: trainingService.submitAnswers,
  });

  useEffect(() => {
    if (!isError) return;

    toast.error(
      error instanceof Error ? error.message : 'Failed to load training tasks.'
    );
  }, [error, isError]);

  const breadcrumbItems = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Training' },
  ];

  const tasks = data?.words ?? [];
  const currentTask = tasks[currentIndex];
  const isLastTask = currentIndex === tasks.length - 1;

  function buildTrainingAnswer(): TrainingAnswer | null {
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
  }

  function buildSubmitPayload(): TrainingAnswer[] {
    const lastAnswer = buildTrainingAnswer();
    return upsertAnswer(answers, lastAnswer);
  }

  const handleNext = () => {
    if (!currentTask || isLastTask) return;

    const nextAnswer = buildTrainingAnswer();

    setAnswers((prev) => upsertAnswer(prev, nextAnswer));
    setCurrentAnswer('');
    setCurrentIndex((prev) => prev + 1);
  };

  const handleCancel = () => {
    router.replace(ROUTES.DICTIONARY);
  };

  const handleSave = async () => {
    if (submitMutation.isPending) return;

    const payload = buildSubmitPayload();

    try {
      const result = await submitMutation.mutateAsync(payload);
      setAnswers(payload);
      setTrainingResult(result);
      setIsWellDoneOpen(true);
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : 'Training progress was not saved.'
      );

      router.replace(ROUTES.DICTIONARY);
    }
  };

  const handleWellDoneClose = () => {
    setIsWellDoneOpen(false);
    router.replace(ROUTES.DICTIONARY);
  };

  if (isLoading) {
    return (
      <main className={css.page}>
        <section className="container">
          <Breadcrumbs items={breadcrumbItems} />

          <div className={css.loaderWrap}>
            <InlineLoader
              text="Loading training tasks..."
              className={css.loader}
            />
          </div>
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main className={css.page}>
        <section className="container">
          <Breadcrumbs items={breadcrumbItems} />

          <div className={css.contentWrap}>
            <EmptyState
              className={css.emptyState}
              title="Something went wrong"
              text="We couldn't load your training tasks right now. Please try again."
              primaryActionLabel="Go to dictionary"
              onPrimaryAction={() => router.push(ROUTES.DICTIONARY)}
              imageSrc="/training-empty.png"
              imageAlt=""
              imageWidth={498}
              imageHeight={435}
            />
          </div>
        </section>
      </main>
    );
  }

  if (!tasks.length) {
    return (
      <main className={css.page}>
        <section className="container">
          <Breadcrumbs items={breadcrumbItems} />

          <div className={css.topBar}>
            <div className={css.statsWrap}>
              <Statistics />
            </div>

            <div className={css.progressWrap}>
              <TrainingProgress current={0} total={1} />
            </div>
          </div>

          <div className={css.contentWrap}>
            <EmptyState
              className={css.emptyState}
              title="You don't have a single word to learn right now."
              text="Please create or add a word to start the workout. We want to improve your vocabulary and develop your knowledge, so please share the words you are interested in adding to your study."
              primaryActionLabel="Add word"
              secondaryActionLabel="Cancel"
              onPrimaryAction={() =>
                router.push(`${ROUTES.DICTIONARY}?openModal=add-word`)
              }
              onSecondaryAction={() => router.push(ROUTES.DICTIONARY)}
              imageSrc="/training-empty.png"
              imageAlt=""
              imageWidth={498}
              imageHeight={435}
            />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={css.page}>
      <section className="container">
        <Breadcrumbs items={breadcrumbItems} />

        <div className={css.topBar}>
          <div className={css.statsWrap}>
            <Statistics />
          </div>

          <div className={css.progressWrap}>
            <TrainingProgress current={answers.length} total={tasks.length} />
          </div>
        </div>

        {currentTask ? (
          <>
            <TrainingRoom
              task={currentTask}
              value={currentAnswer}
              onChange={setCurrentAnswer}
              onNext={handleNext}
              onSave={handleSave}
              onCancel={handleCancel}
              showNext={!isLastTask}
              isSubmitting={submitMutation.isPending}
            />

            <WellDoneModal
              isOpen={isWellDoneOpen}
              result={trainingResult}
              onClose={handleWellDoneClose}
            />
          </>
        ) : null}
      </section>
    </main>
  );
}

export default TrainingPageClient;
