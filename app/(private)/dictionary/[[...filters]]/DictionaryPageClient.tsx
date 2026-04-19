'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-hot-toast';

import type { WordItem } from '@/types/word';
import { wordsService } from '@/lib/services/words.service';

import {
  buildWordsPath,
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
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal/ConfirmDeleteModal';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';

import css from './page.module.css';

//===============================================================

const WORDS_PER_PAGE = 7;

//===============================================================

function DictionaryPageClient() {
  const router = useRouter();
  const pathname = usePathname();

  const params = useParams<{ filters?: string[] | string }>();
  const searchParams = useSearchParams();
  const shouldAutoOpenAddModal = searchParams.get('openModal') === 'add-word';
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(
    () => shouldAutoOpenAddModal
  );

  const [editingWord, setEditingWord] = useState<WordItem | null>(null);
  const [deletingWord, setDeletingWord] = useState<WordItem | null>(null);

  const rawFiltersParam = params.filters;

  useEffect(() => {
    if (!shouldAutoOpenAddModal) return;

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('openModal');

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams, shouldAutoOpenAddModal]);

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
  const newWordId = searchParams.get('newWordId')?.trim() ?? '';

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
      sort: routeFilters.sort,
      newWordId: newWordId || undefined,
    }),
    [keyword, newWordId, routeFilters]
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
          href: buildWordsPath('/dictionary', {
            category: routeFilters.category,
            isIrregular: undefined,
            page: 1,
            sort: routeFilters.sort,
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

  const { data: statistics } = useQuery({
    queryKey: ['words-statistics'],
    queryFn: wordsService.getStatistics,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => wordsService.deleteWord(id),
    onSuccess: (result) => {
      toast.success(result.message || 'Word deleted successfully.');

      setDeletingWord(null);

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

  const rows = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? routeFilters.page;
  const totalCount = statistics?.totalCount ?? 0;

  const handlePageChange = (nextPage: number) => {
    const nextPath = buildWordsPath('/dictionary', {
      category: routeFilters.category,
      isIrregular:
        routeFilters.category === 'verb' ? routeFilters.isIrregular : undefined,
      page: nextPage,
      sort: routeFilters.sort,
    });

    const nextParams = new URLSearchParams();

    if (keyword) {
      nextParams.set('keyword', keyword);
    }

    const query = nextParams.toString();

    router.push(query ? `${nextPath}?${query}` : nextPath, {
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
            totalCount={totalCount}
            showAddWord
            showTrainLink
            onAddWord={() => setIsAddModalOpen(true)}
          />

          <EmptyState
            title="Something went wrong"
            text="We couldn’t load your words. Please try again."
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
          variant="dictionary"
          totalCount={totalCount}
          showAddWord
          showTrainLink
          onAddWord={() => setIsAddModalOpen(true)}
        />

        {isLoading ? (
          <div className={css.loaderWrap}>
            <InlineLoader text="Loading your words…" className={css.loader} />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title="Your dictionary is empty"
            text="Add your first word and start building your vocabulary."
            imageSrc="/training-empty.png"
            imageWidth={190}
            imageHeight={190}
            primaryActionLabel="Add word"
            onPrimaryAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <>
            <WordsTable
              variant="dictionary"
              rows={rows}
              onEdit={(word) => setEditingWord(word)}
              onDelete={(word) => setDeletingWord(word)}
            />

            <WordsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        <AddWordModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        <EditWordModal
          isOpen={Boolean(editingWord)}
          word={editingWord}
          onClose={() => setEditingWord(null)}
        />

        <ConfirmDeleteModal
          isOpen={Boolean(deletingWord)}
          wordLabel={deletingWord?.en}
          isSubmitting={deleteMutation.isPending}
          onClose={() => setDeletingWord(null)}
          onConfirm={handleDeleteConfirm}
        />
      </section>
    </main>
  );
}

export default DictionaryPageClient;
