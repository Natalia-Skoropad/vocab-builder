'use client';

import { useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import type { WordItem } from '@/types/word';
import { wordsService } from '@/lib/services/words.service';

import {
  buildDictionaryPath,
  parseDictionarySegments,
} from '@/lib/utils/dictionary.query';

import Dashboard from '@/components/dashboard/Dashboard/Dashboard';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import InlineLoader from '@/components/common/InlineLoader/InlineLoader';
import WordsPagination from '@/components/words/WordsPagination/WordsPagination';
import WordsTable from '@/components/words/WordsTable/WordsTable';

import css from './page.module.css';

//===============================================================

const WORDS_PER_PAGE = 7;

//===============================================================

function RecommendPage() {
  const router = useRouter();
  const params = useParams<{ filters?: string[] | string }>();
  const searchParams = useSearchParams();

  const rawFiltersParam = params.filters;

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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'recommend-words',
      keyword,
      filters.category,
      filters.isIrregular,
      filters.page,
    ],
    queryFn: () =>
      wordsService.getAllWords({
        keyword,
        category: filters.category,
        isIrregular:
          filters.category === 'verb' ? filters.isIrregular : undefined,
        page: filters.page,
        limit: WORDS_PER_PAGE,
      }),
  });

  const rows: WordItem[] = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? filters.page;

  const handlePageChange = (nextPage: number) => {
    const nextPath = buildDictionaryPath({
      category: filters.category,
      isIrregular:
        filters.category === 'verb' ? filters.isIrregular : undefined,
      page: nextPage,
    });

    const nextParams = new URLSearchParams();

    if (keyword) {
      nextParams.set('keyword', keyword);
    }

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${nextPath}?${nextQuery}` : nextPath;

    router.push(nextUrl, { scroll: false });
  };

  if (isError) {
    toast.error(
      error instanceof Error
        ? error.message
        : 'Failed to load recommended words.'
    );

    return (
      <main className={css.page}>
        <section className="container">
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
            <WordsTable variant="recommend" rows={rows} />
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

export default RecommendPage;
