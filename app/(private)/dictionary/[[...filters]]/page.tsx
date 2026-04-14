'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import type { WordItem } from '@/types/word';
import { wordsService } from '@/lib/services/words.service';

import {
  buildDictionaryPath,
  formatDictionaryCategoryLabel,
  parseDictionarySegments,
} from '@/lib/utils/dictionary.query';

import Dashboard from '@/components/dashboard/Dashboard/Dashboard';
import WordsTable from '@/components/words/WordsTable/WordsTable';
import WordsPagination from '@/components/words/WordsPagination/WordsPagination';
import InlineLoader from '@/components/common/InlineLoader/InlineLoader';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import AddWordModal from '@/components/modals/AddWordModal/AddWordModal';
import EditWordModal from '@/components/modals/EditWordModal/EditWordModal';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';

//===============================================================

const WORDS_PER_PAGE = 7;

//===============================================================

function DictionaryPage() {
  const router = useRouter();
  const params = useParams<{ filters?: string[] | string }>();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<WordItem | null>(null);

  const rawFiltersParam = params.filters;

  const routeSegments = useMemo<string[]>(() => {
    if (Array.isArray(rawFiltersParam)) {
      return rawFiltersParam;
    }

    if (typeof rawFiltersParam === 'string' && rawFiltersParam.trim()) {
      return [rawFiltersParam];
    }

    return [];
  }, [rawFiltersParam]);

  const { filters: routeFilters } = useMemo(
    () => parseDictionarySegments(routeSegments),
    [routeSegments]
  );

  const keyword = searchParams.get('keyword')?.trim() ?? '';

  const queryParams = useMemo(
    () => ({
      page: routeFilters.page,
      limit: WORDS_PER_PAGE,
      keyword: keyword || undefined,
      category:
        routeFilters.category !== 'categories'
          ? routeFilters.category
          : undefined,
      isIrregular:
        routeFilters.category === 'verb' ? routeFilters.isIrregular : undefined,
    }),
    [keyword, routeFilters]
  );

  const breadcrumbItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [
      { label: 'Home', href: '/' },
      { label: 'Dictionary', href: '/dictionary' },
    ];

    if (routeFilters.category !== 'categories') {
      const categoryLabel = formatDictionaryCategoryLabel(
        routeFilters.category
      );

      if (
        routeFilters.category === 'verb' &&
        typeof routeFilters.isIrregular === 'boolean'
      ) {
        items.push({
          label: categoryLabel,
          href: buildDictionaryPath({
            category: routeFilters.category,
            page: 1,
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
  }, [routeFilters]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dictionary-words', queryParams],
    queryFn: () => wordsService.getOwnWords(queryParams),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => wordsService.deleteWord(id),
    onSuccess: (result) => {
      toast.success(result.message || 'Word deleted successfully.');

      void queryClient.invalidateQueries({
        queryKey: ['dictionary-words'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['words-statistics'],
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

  const handleEdit = (word: WordItem) => {
    setEditingWord(word);
  };

  const handleDelete = (word: WordItem) => {
    void deleteMutation.mutateAsync(word._id);
  };

  const handlePageChange = (nextPage: number) => {
    const nextPath = buildDictionaryPath({
      category: routeFilters.category,
      isIrregular: routeFilters.isIrregular,
      page: nextPage,
    });

    const nextParams = new URLSearchParams();

    if (keyword) {
      nextParams.set('keyword', keyword);
    }

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${nextPath}?${nextQuery}` : nextPath;

    router.replace(nextUrl, { scroll: false });
  };

  const handleAddWord = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeEditModal = () => {
    setEditingWord(null);
  };

  return (
    <>
      <main>
        <section aria-labelledby="dictionary-title">
          <div className="container">
            <h1 id="dictionary-title" className="visually-hidden">
              Dictionary
            </h1>

            <Breadcrumbs items={breadcrumbItems} />

            <Dashboard
              variant="dictionary"
              showAddWord
              showTrainLink
              onAddWord={handleAddWord}
            />

            {isLoading ? <InlineLoader text="Loading words…" /> : null}

            {!isLoading && isError ? (
              <EmptyState
                title="Failed to load dictionary"
                text={
                  error instanceof Error
                    ? error.message
                    : 'Please try again a little later.'
                }
                imageSrc="/training-empty.png"
                imageWidth={180}
                imageHeight={180}
              />
            ) : null}

            {!isLoading && !isError && data?.results.length === 0 ? (
              <EmptyState
                title="Your dictionary is empty"
                text="Add your first word to start building your personal vocabulary collection and begin learning new words."
                imageSrc="/training-empty.png"
                imageWidth={190}
                imageHeight={190}
                primaryActionLabel="Add word"
                onPrimaryAction={handleAddWord}
              />
            ) : null}

            {!isLoading && !isError && data && data.results.length > 0 ? (
              <>
                <WordsTable
                  variant="dictionary"
                  rows={data.results}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

                <WordsPagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : null}
          </div>
        </section>
      </main>

      <AddWordModal isOpen={isAddModalOpen} onClose={closeAddModal} />

      <EditWordModal
        isOpen={Boolean(editingWord)}
        onClose={closeEditModal}
        word={editingWord}
      />
    </>
  );
}

export default DictionaryPage;
