'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  OwnWordsResponse,
  RecommendedWordItem,
  WordItem,
} from '@/types/word';
import { wordsService } from '@/lib/services/words.service';

import { type WordProgressFilter } from '@/lib/utils/dictionary.query';
import { useWordsRouteState } from '@/hooks/useWordsRouteState';

import {
  invalidateDictionaryQueries,
  invalidateWordsStatisticsQueries,
  showMutationErrorToast,
  showMutationSuccessToast,
} from '@/lib/words/mutation-helpers';

import { wordsQueryKeys } from '@/lib/words/query-keys';

import Dashboard from '@/components/dashboard/Dashboard/Dashboard';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import InlineLoader from '@/components/common/InlineLoader/InlineLoader';
import WordsPagination from '@/components/words/WordsPagination/WordsPagination';
import WordsTable from '@/components/words/WordsTable/WordsTable';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';

import css from './page.module.css';

//===============================================================

const WORDS_PER_PAGE = 7;
const OWN_WORDS_LOOKUP_LIMIT = 1000;
const PROGRESS_FILTER_FALLBACK_LIMIT = 1000;

//===============================================================

function normalizeWordKey(
  word: Pick<RecommendedWordItem | WordItem, 'en' | 'ua' | 'category'>
) {
  return `${word.en.trim().toLowerCase()}__${word.ua
    .trim()
    .toLowerCase()}__${word.category.trim().toLowerCase()}`;
}

function filterRowsByProgress(
  rows: WordItem[],
  progressFilter?: WordProgressFilter
): WordItem[] {
  if (!progressFilter) return rows;

  const target = Number(progressFilter);

  return rows.filter((row) => Math.round(Number(row.progress) || 0) === target);
}

function appendOwnWordToCache(
  previousData: OwnWordsResponse | undefined,
  nextWord: WordItem
): OwnWordsResponse | undefined {
  if (!previousData) return previousData;

  const alreadyExists = previousData.results.some(
    (word) => word._id === nextWord._id
  );

  if (alreadyExists) return previousData;

  return {
    ...previousData,
    results: [nextWord, ...previousData.results],
  };
}

//===============================================================

function RecommendPageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [addingWordId, setAddingWordId] = useState<string | null>(null);

  const { filters, queryParams, hasActiveSearchOrFilters, buildPageUrl } =
    useWordsRouteState({
      variant: 'recommend',
      wordsPerPage: WORDS_PER_PAGE,
    });

  const addToDictionaryMutation = useMutation({
    mutationFn: (wordId: string) => wordsService.addWordFromRecommend(wordId),
    onSuccess: async (addedWord) => {
      showMutationSuccessToast(
        'Word added to dictionary.',
        'Word added to dictionary.'
      );

      queryClient.setQueryData<OwnWordsResponse | undefined>(
        wordsQueryKeys.recommendOwn,
        (previousData) => appendOwnWordToCache(previousData, addedWord)
      );

      await Promise.all([
        invalidateDictionaryQueries(queryClient),
        invalidateWordsStatisticsQueries(queryClient),
      ]);
    },
    onError: (mutationError) => {
      showMutationErrorToast(
        mutationError,
        'Failed to add word to dictionary.'
      );
    },
    onSettled: () => {
      setAddingWordId(null);
    },
  });

  const { data: ownWordsData } = useQuery({
    queryKey: wordsQueryKeys.recommendOwn,
    queryFn: () =>
      wordsService.getOwnWords({
        page: 1,
        limit: OWN_WORDS_LOOKUP_LIMIT,
      }),
    placeholderData: (previousData) => previousData,
  });

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: wordsQueryKeys.recommend(queryParams, filters.progress),
    queryFn: async () => {
      try {
        if (!filters.progress) {
          return await wordsService.getAllWords(queryParams);
        }

        return await wordsService.getAllWords({
          ...queryParams,
          page: 1,
          limit: PROGRESS_FILTER_FALLBACK_LIMIT,
        });
      } catch (queryError) {
        if (hasActiveSearchOrFilters) {
          return {
            results: [],
            totalPages: 1,
            page: filters.page,
            perPage: WORDS_PER_PAGE,
          };
        }

        throw queryError;
      }
    },
  });

  const mergedRows = useMemo<WordItem[]>(() => {
    const recommendRows = data?.results ?? [];
    const ownWords = ownWordsData?.results ?? [];

    if (!recommendRows.length) return [];

    const ownWordsMap = new Map(
      ownWords.map((word) => [normalizeWordKey(word), word])
    );

    return recommendRows.map((word) => {
      const matchedOwnWord = ownWordsMap.get(normalizeWordKey(word));

      return {
        ...word,
        owner: matchedOwnWord?.owner ?? word.owner,
        progress: matchedOwnWord?.progress ?? word.progress ?? 0,
      };
    });
  }, [data?.results, ownWordsData?.results]);

  const pagedState = useMemo(() => {
    if (!filters.progress) {
      return {
        rows: mergedRows,
        totalPages: data?.totalPages ?? 1,
        currentPage: data?.page ?? filters.page,
      };
    }

    const filteredRows = filterRowsByProgress(mergedRows, filters.progress);
    const totalPages = Math.max(
      1,
      Math.ceil(filteredRows.length / WORDS_PER_PAGE)
    );
    const currentPage = Math.min(filters.page, totalPages);
    const start = (currentPage - 1) * WORDS_PER_PAGE;

    return {
      rows: filteredRows.slice(start, start + WORDS_PER_PAGE),
      totalPages,
      currentPage,
    };
  }, [
    data?.page,
    data?.totalPages,
    filters.page,
    filters.progress,
    mergedRows,
  ]);

  const rows = pagedState.rows;
  const totalPages = pagedState.totalPages;
  const currentPage = pagedState.currentPage;

  const showLoader =
    (isLoading || isFetching) && !addToDictionaryMutation.isPending;

  const handleAddToDictionary = async (word: WordItem) => {
    if (addingWordId || word.owner || addToDictionaryMutation.isPending) return;

    setAddingWordId(word._id);
    await addToDictionaryMutation.mutateAsync(word._id);
  };

  const handlePageChange = (nextPage: number) => {
    router.push(buildPageUrl(nextPage), { scroll: false });
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Recommend' },
  ];

  if (isError) {
    return (
      <main className={css.page}>
        <section className="container">
          <Breadcrumbs items={breadcrumbItems} />

          <Dashboard variant="recommend" showAddWord={false} showTrainLink />

          <EmptyState
            title="Something went wrong"
            text="We couldn’t load the recommended words. Please try again."
            imageSrc="/training-empty.png"
            imageWidth={190}
            imageHeight={190}
          />
        </section>
      </main>
    );
  }

  return (
    <main className={css.page}>
      <section className="container">
        <Breadcrumbs items={breadcrumbItems} />

        <Dashboard variant="recommend" showAddWord={false} showTrainLink />

        {showLoader ? (
          <div className={css.loaderWrap}>
            <InlineLoader
              text="Loading recommended words…"
              className={css.loader}
            />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title={
              hasActiveSearchOrFilters
                ? 'No recommended words found'
                : 'No recommended words yet'
            }
            text="There are no words matching your current search or filters."
            imageSrc="/training-empty.png"
            imageWidth={190}
            imageHeight={190}
          />
        ) : (
          <>
            <WordsTable
              variant="recommend"
              rows={rows}
              onAddToDictionary={handleAddToDictionary}
              addingWordId={addingWordId}
            />

            <WordsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </main>
  );
}

export default RecommendPageClient;
