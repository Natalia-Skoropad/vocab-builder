'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import type { RecommendedWordItem, WordItem } from '@/types/word';
import { wordsService } from '@/lib/services/words.service';

import { type WordProgressFilter } from '@/lib/utils/dictionary.query';
import { useWordsRouteState } from '@/hooks/useWordsRouteState';

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
  rows: RecommendedWordItem[],
  progressFilter?: WordProgressFilter
): RecommendedWordItem[] {
  if (!progressFilter) return rows;

  const target = Number(progressFilter);

  return rows.filter((row) => Math.round(Number(row.progress) || 0) === target);
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
    mutationFn: (word: RecommendedWordItem) =>
      wordsService.addWordFromRecommend(word._id),
    onSuccess: async () => {
      toast.success('Word added to dictionary.');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['recommend-words'] }),
        queryClient.invalidateQueries({ queryKey: ['dictionary-words'] }),
        queryClient.invalidateQueries({ queryKey: ['words-statistics'] }),
        queryClient.invalidateQueries({ queryKey: ['recommend-own-words'] }),
        queryClient.invalidateQueries({ queryKey: ['words-learned-count'] }),
      ]);
    },
    onError: (mutationError) => {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to add word to dictionary.'
      );
    },
    onSettled: () => {
      setAddingWordId(null);
    },
  });

  const { data: ownWordsData } = useQuery({
    queryKey: ['recommend-own-words'],
    queryFn: () =>
      wordsService.getOwnWords({
        page: 1,
        limit: OWN_WORDS_LOOKUP_LIMIT,
      }),
    placeholderData: (previousData) => previousData,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recommend-words', queryParams, filters.progress],
    queryFn: async () => {
      if (!filters.progress) {
        return wordsService.getAllWords(queryParams);
      }

      const allData = await wordsService.getAllWords({
        ...queryParams,
        page: 1,
        limit: PROGRESS_FILTER_FALLBACK_LIMIT,
      });

      const filtered = filterRowsByProgress(allData.results, filters.progress);
      const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / WORDS_PER_PAGE)
      );
      const safePage = Math.min(filters.page, totalPages);
      const start = (safePage - 1) * WORDS_PER_PAGE;
      const paged = filtered.slice(start, start + WORDS_PER_PAGE);

      return {
        results: paged,
        totalPages,
        page: safePage,
        perPage: WORDS_PER_PAGE,
      };
    },
    placeholderData: (previousData) => previousData,
  });

  const rows = useMemo<WordItem[]>(() => {
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

  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? filters.page;

  const handleAddToDictionary = async (word: WordItem) => {
    if (addingWordId || word.owner) return;

    setAddingWordId(word._id);
    await addToDictionaryMutation.mutateAsync(word);
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

        {isLoading && !data ? (
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
