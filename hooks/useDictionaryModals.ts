'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { WordItem } from '@/types/word';

//===============================================================

export function useDictionaryModals() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const shouldAutoOpenAddModal = searchParams.get('openModal') === 'add-word';

  const [isAddModalOpen, setIsAddModalOpen] = useState(
    () => shouldAutoOpenAddModal
  );
  const [editingWord, setEditingWord] = useState<WordItem | null>(null);
  const [deletingWord, setDeletingWord] = useState<WordItem | null>(null);

  useEffect(() => {
    if (!shouldAutoOpenAddModal) return;

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('openModal');

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams, shouldAutoOpenAddModal]);

  return {
    isAddModalOpen,
    openAddModal: () => setIsAddModalOpen(true),
    closeAddModal: () => setIsAddModalOpen(false),

    editingWord,
    startEditWord: (word: WordItem) => setEditingWord(word),
    stopEditWord: () => setEditingWord(null),

    deletingWord,
    startDeleteWord: (word: WordItem) => setDeletingWord(word),
    stopDeleteWord: () => setDeletingWord(null),

    clearDeletingWord: () => setDeletingWord(null),
  };
}
