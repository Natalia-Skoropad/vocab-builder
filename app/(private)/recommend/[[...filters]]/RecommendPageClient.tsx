'use client';

import { useEffect, useMemo, useState } from 'react';
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

function normalizeWordKey(word: Pick<WordItem, 'en' | 'ua' | 'category'>) {
  return `${word.en.trim().toLowerCase()}__${word.ua
    .trim()
    .toLowerCase()}__${word.category.trim().toLowerCase()}`;
}

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
  const hasIrregularFilter = typeof filters.isIrregular === 'boolean';

  const hasActiveSearchOrFilters =
    Boolean(keyword) ||
    filters.category !== 'categories' ||
    Boolean(filters.sort) ||
    hasIrregularFilter;

  const addToDictionaryMutation = useMutation({
    mutationFn: (word: WordItem) => wordsService.addWordFromRecommend(word._id),
    onSuccess: async () => {
      toast.success('Word added to dictionary.');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['recommend-words'] }),
        queryClient.invalidateQueries({ queryKey: ['dictionary-words'] }),
        queryClient.invalidateQueries({ queryKey: ['words-statistics'] }),
        queryClient.invalidateQueries({ queryKey: ['recommend-own-words'] }),
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

  const handleAddToDictionary = async (word: WordItem) => {
    if (word.owner) return;

    setAddingWordId(word._id);
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
    queryFn: async () => {
      try {
        return await wordsService.getAllWords({
          keyword,
          category: filters.category,
          isIrregular:
            filters.category === 'verb' ? filters.isIrregular : undefined,
          page: filters.page,
          limit: WORDS_PER_PAGE,
          sort: filters.sort,
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

  const { data: ownWordsData } = useQuery({
    queryKey: ['recommend-own-words'],
    queryFn: () =>
      wordsService.getOwnWords({
        page: 1,
        limit: 1000,
      }),
  });

  useEffect(() => {
    if (!isError) return;

    toast.error(
      error instanceof Error
        ? error.message
        : 'Failed to load recommended words.'
    );
  }, [isError, error]);

  const ownWordsMap = useMemo(() => {
    const map = new Map<string, WordItem>();

    for (const word of ownWordsData?.results ?? []) {
      map.set(normalizeWordKey(word), word);
    }

    return map;
  }, [ownWordsData?.results]);

  const rows: WordItem[] = useMemo(() => {
    return (data?.results ?? []).map((word) => {
      const ownWord = ownWordsMap.get(normalizeWordKey(word));

      if (!ownWord) {
        return {
          ...word,
          progress:
            typeof word.progress === 'number'
              ? word.progress
              : Number(word.progress) || 0,
        };
      }

      return {
        ...word,
        owner: ownWord.owner,
        progress: ownWord.progress,
      };
    });
  }, [data?.results, ownWordsMap]);

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
          <div className={css.loaderWrap}>
            <InlineLoader
              text="Loading recommended words…"
              className={css.loader}
            />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No recommended words found"
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
