'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-hot-toast';

import type { WordItem } from '@/types/word';
import { wordsService } from '@/lib/services/words.service';

import {
  buildWordsPath,
  formatDictionaryCategoryLabel,
  type WordProgressFilter,
} from '@/lib/utils/dictionary.query';
import { useWordsRouteState } from '@/hooks/useWordsRouteState';
import { useDictionaryModals } from '@/hooks/useDictionaryModals';

import Dashboard from '@/components/dashboard/Dashboard/Dashboard';
import WordsTable from '@/components/words/WordsTable/WordsTable';
import WordsPagination from '@/components/words/WordsPagination/WordsPagination';
import InlineLoader from '@/components/common/InlineLoader/InlineLoader';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import AddWordModal from '@/components/modals/AddWordModal/AddWordModal';
import EditWordModal from '@/components/modals/EditWordModal/EditWordModal';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal/ConfirmDeleteModal';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';

import css from './page.module.css';

//===============================================================

const WORDS_PER_PAGE = 7;
const PROGRESS_FILTER_FALLBACK_LIMIT = 1000;

//===============================================================

function filterRowsByProgress(
  rows: WordItem[],
  progressFilter?: WordProgressFilter
): WordItem[] {
  if (!progressFilter) return rows;

  const target = Number(progressFilter);

  return rows.filter((row) => Math.round(Number(row.progress) || 0) === target);
}

//===============================================================

function DictionaryPageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    editingWord,
    startEditWord,
    stopEditWord,
    deletingWord,
    startDeleteWord,
    stopDeleteWord,
    clearDeletingWord,
  } = useDictionaryModals();

  const {
    filters: routeFilters,
    queryParams,
    hasIrregularFilter,
    hasActiveSearchOrFilters,
    buildPageUrl,
  } = useWordsRouteState({
    variant: 'dictionary',
    wordsPerPage: WORDS_PER_PAGE,
    includeNewWordId: true,
  });

  const breadcrumbItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [
      { label: 'Home', href: '/' },
      { label: 'Dictionary', href: '/dictionary' },
    ];

    if (routeFilters.category !== 'categories') {
      const categoryLabel = formatDictionaryCategoryLabel(
        routeFilters.category
      );

      if (routeFilters.category === 'verb' && hasIrregularFilter) {
        items.push({
          label: categoryLabel,
          href: buildWordsPath('/dictionary', {
            category: routeFilters.category,
            isIrregular: undefined,
            page: 1,
            sort: routeFilters.sort,
            progress: routeFilters.progress,
          }),
        });

        items.push({
          label: routeFilters.isIrregular ? 'Irregular' : 'Regular',
        });
      } else {
        items.push({
          label: categoryLabel,
        });
      }
    }

    return items;
  }, [hasIrregularFilter, routeFilters]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dictionary-words', queryParams, routeFilters.progress],
    queryFn: async () => {
      try {
        if (!routeFilters.progress) {
          return await wordsService.getOwnWords(queryParams);
        }

        const allData = await wordsService.getOwnWords({
          ...queryParams,
          page: 1,
          limit: PROGRESS_FILTER_FALLBACK_LIMIT,
          newWordId: undefined,
        });

        const filtered = filterRowsByProgress(
          allData.results,
          routeFilters.progress
        );

        const totalPages = Math.max(
          1,
          Math.ceil(filtered.length / WORDS_PER_PAGE)
        );

        const safePage = Math.min(routeFilters.page, totalPages);
        const start = (safePage - 1) * WORDS_PER_PAGE;
        const paged = filtered.slice(start, start + WORDS_PER_PAGE);

        return {
          results: paged,
          totalPages,
          page: safePage,
          perPage: WORDS_PER_PAGE,
        };
      } catch (queryError) {
        if (hasActiveSearchOrFilters) {
          return {
            results: [],
            totalPages: 1,
            page: routeFilters.page,
            perPage: WORDS_PER_PAGE,
          };
        }

        throw queryError;
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => wordsService.deleteWord(id),
    onSuccess: (result) => {
      toast.success(result.message || 'Word deleted successfully.');

      clearDeletingWord();

      void queryClient.invalidateQueries({
        queryKey: ['dictionary-words'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['words-statistics'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['words-learned-count'],
      });
    },
    onError: (mutationError) => {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to delete word.'
      );
    },
  });

  const rows = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? routeFilters.page;

  const handlePageChange = (nextPage: number) => {
    router.push(buildPageUrl(nextPage), {
      scroll: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingWord) return;
    await deleteMutation.mutateAsync(deletingWord._id);
  };

  useEffect(() => {
    if (!isError) return;

    toast.error(
      error instanceof Error
        ? error.message
        : 'Failed to load dictionary words.'
    );
  }, [error, isError]);

  if (isError) {
    return (
      <main className={css.page}>
        <section className="container">
          <Breadcrumbs items={breadcrumbItems} />

          <Dashboard
            variant="dictionary"
            showAddWord
            showTrainLink
            onAddWord={openAddModal}
          />

          <EmptyState
            title="Something went wrong"
            text="We couldn’t load your words. Please try again."
            imageSrc="/training-empty.png"
            imageWidth={190}
            imageHeight={190}
          />

          <AddWordModal isOpen={isAddModalOpen} onClose={closeAddModal} />
        </section>
      </main>
    );
  }

  return (
    <main className={css.page}>
      <section className="container">
        <Breadcrumbs items={breadcrumbItems} />

        <Dashboard
          variant="dictionary"
          showAddWord
          showTrainLink
          onAddWord={openAddModal}
        />

        {isLoading ? (
          <div className={css.loaderWrap}>
            <InlineLoader text="Loading your words…" className={css.loader} />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title={
              hasActiveSearchOrFilters
                ? 'No words found'
                : 'Your dictionary is empty'
            }
            text={
              hasActiveSearchOrFilters
                ? 'There are no words matching your current search or filters.'
                : 'Add your first word and start building your vocabulary.'
            }
            imageSrc="/training-empty.png"
            imageWidth={190}
            imageHeight={190}
            primaryActionLabel={
              hasActiveSearchOrFilters ? undefined : 'Add word'
            }
            onPrimaryAction={
              hasActiveSearchOrFilters ? undefined : openAddModal
            }
          />
        ) : (
          <>
            <WordsTable
              variant="dictionary"
              rows={rows}
              onEdit={startEditWord}
              onDelete={startDeleteWord}
            />

            <WordsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        <AddWordModal isOpen={isAddModalOpen} onClose={closeAddModal} />

        <EditWordModal
          isOpen={Boolean(editingWord)}
          word={editingWord}
          onClose={stopEditWord}
        />

        <ConfirmDeleteModal
          isOpen={Boolean(deletingWord)}
          wordLabel={deletingWord?.en}
          isSubmitting={deleteMutation.isPending}
          onClose={stopDeleteWord}
          onConfirm={handleDeleteConfirm}
        />
      </section>
    </main>
  );
}

export default DictionaryPageClient;
