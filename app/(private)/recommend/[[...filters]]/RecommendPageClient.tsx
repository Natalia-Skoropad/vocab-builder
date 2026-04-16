'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import type { WordItem } from '@/types/word';
import { wordsService } from '@/lib/services/words.service';

import {
  buildWordsPath,
  parseDictionarySegments,
} from '@/lib/utils/dictionary.query';

import Dashboard from '@/components/dashboard/Dashboard/Dashboard';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import InlineLoader from '@/components/common/InlineLoader/InlineLoader';
import WordsPagination from '@/components/words/WordsPagination/WordsPagination';
import WordsTable from '@/components/words/WordsTable/WordsTable';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';

import css from './page.module.css';

//===============================================================

const WORDS_PER_PAGE = 7;

//===============================================================

function RecommendPageClient() {
  const router = useRouter();
  const params = useParams<{ filters?: string[] | string }>();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const rawFiltersParam = params.filters;
  const [addingWordId, setAddingWordId] = useState<string | null>(null);

  const routeSegments = useMemo<string[]>(() => {
    if (Array.isArray(rawFiltersParam)) return rawFiltersParam;
    if (typeof rawFiltersParam === 'string' && rawFiltersParam.trim()) {
      return [rawFiltersParam];
    }
    return [];
  }, [rawFiltersParam]);

  const { filters } = useMemo(
    () => parseDictionarySegments(routeSegments),
    [routeSegments]
  );

  const keyword = searchParams.get('keyword')?.trim() ?? '';

  const addToDictionaryMutation = useMutation({
    mutationFn: async (word: WordItem) => {
      setAddingWordId(word._id);
      return wordsService.addWordFromRecommend(word._id);
    },
    onSuccess: async () => {
      toast.success('Word added to dictionary.');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['recommend-words'] }),
        queryClient.invalidateQueries({ queryKey: ['dictionary-words'] }),
        queryClient.invalidateQueries({ queryKey: ['words-statistics'] }),
      ]);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to add word to dictionary.'
      );
    },
    onSettled: () => {
      setAddingWordId(null);
    },
  });

  const handleAddToDictionary = async (word: WordItem) => {
    await addToDictionaryMutation.mutateAsync(word);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'recommend-words',
      keyword,
      filters.category,
      filters.isIrregular,
      filters.page,
      filters.sort,
    ],
    queryFn: () =>
      wordsService.getAllWords({
        keyword,
        category: filters.category,
        isIrregular:
          filters.category === 'verb' ? filters.isIrregular : undefined,
        page: filters.page,
        limit: WORDS_PER_PAGE,
        sort: filters.sort,
      }),
  });

  const rows: WordItem[] = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? filters.page;

  const handlePageChange = (nextPage: number) => {
    const nextPath = buildWordsPath('/recommend', {
      category: filters.category,
      isIrregular:
        filters.category === 'verb' ? filters.isIrregular : undefined,
      page: nextPage,
      sort: filters.sort,
    });

    const nextParams = new URLSearchParams();

    if (keyword) {
      nextParams.set('keyword', keyword);
    }

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${nextPath}?${nextQuery}` : nextPath;

    router.push(nextUrl, { scroll: false });
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Recommend' },
  ];

  if (isError) {
    toast.error(
      error instanceof Error
        ? error.message
        : 'Failed to load recommended words.'
    );

    return (
      <main className={css.page}>
        <section className="container">
          <Breadcrumbs items={breadcrumbItems} />

          <Dashboard
            variant="recommend"
            totalCount={0}
            showAddWord={false}
            showTrainLink
          />

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

        <Dashboard
          variant="recommend"
          totalCount={0}
          showAddWord={false}
          showTrainLink
        />

        {isLoading ? (
          <InlineLoader text="Loading recommended words…" />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No recommended words found"
            text="Try changing the search query or selected category."
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
