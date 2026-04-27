'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import type { TrainingSubmitResponse } from '@/types/training';

import { ROUTES } from '@/lib/constants/routes';
import { trainingService } from '@/lib/services/training.service';
import { useTrainingSession } from '@/hooks/useTrainingSession';

import {
  invalidateDictionaryQueries,
  invalidateWordsStatisticsQueries,
} from '@/lib/words/mutation-helpers';

import { wordsQueryKeys } from '@/lib/words/query-keys';

import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import InlineLoader from '@/components/common/InlineLoader/InlineLoader';
import Statistics from '@/components/dashboard/Statistics/Statistics';
import WellDoneModal from '@/components/modals/WellDoneModal/WellDoneModal';
import TrainingProgress from '@/components/training/TrainingProgress/TrainingProgress';
import TrainingRoom from '@/components/training/TrainingRoom/TrainingRoom';

import css from './page.module.css';

//===============================================================

function TrainingPageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isWellDoneOpen, setIsWellDoneOpen] = useState(false);
  const [trainingResult, setTrainingResult] = useState<TrainingSubmitResponse>(
    []
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['training-tasks'],
    queryFn: trainingService.getTasks,
    retry: false,
  });

  const tasks = data?.words ?? [];

  const {
    currentTask,
    currentAnswer,
    setCurrentAnswer,
    progressCount,
    isLastTask,
    buildSubmitPayload,
    goToNextTask,
    applySubmittedPayload,
  } = useTrainingSession(tasks);

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

  const handleCancel = () => {
    router.replace(ROUTES.DICTIONARY);
  };

  const handleSave = async () => {
    if (submitMutation.isPending) return;

    const payload = buildSubmitPayload();

    try {
      const result = await submitMutation.mutateAsync(payload);

      await Promise.all([
        invalidateDictionaryQueries(queryClient),
        invalidateWordsStatisticsQueries(queryClient),
        queryClient.invalidateQueries({
          queryKey: wordsQueryKeys.recommendOwn,
        }),
      ]);

      applySubmittedPayload(payload);
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
        <section className="container" aria-labelledby="training-page-title">
          <Breadcrumbs items={breadcrumbItems} />

          <h1 id="training-page-title" className="visually-hidden">
            Training
          </h1>

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
        <section className="container" aria-labelledby="training-page-title">
          <Breadcrumbs items={breadcrumbItems} />

          <h1 id="training-page-title" className="visually-hidden">
            Training
          </h1>

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
        <section className="container" aria-labelledby="training-page-title">
          <Breadcrumbs items={breadcrumbItems} />

          <h1 id="training-page-title" className="visually-hidden">
            Training
          </h1>

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
              onPrimaryAction={() =>
                router.push(`${ROUTES.DICTIONARY}?openModal=add-word`)
              }
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
      <section className="container" aria-labelledby="training-page-title">
        <Breadcrumbs items={breadcrumbItems} />

        <h1 id="training-page-title" className="visually-hidden">
          Training
        </h1>

        <div className={css.topBar}>
          <div className={css.statsWrap}>
            <Statistics />
          </div>

          <div className={css.progressWrap}>
            <TrainingProgress current={progressCount} total={tasks.length} />
          </div>
        </div>

        {currentTask ? (
          <>
            <TrainingRoom
              task={currentTask}
              value={currentAnswer}
              onChange={setCurrentAnswer}
              onNext={goToNextTask}
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
