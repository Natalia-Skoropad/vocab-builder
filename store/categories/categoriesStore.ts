import { create } from 'zustand';

import type { WordCategory } from '@/types/word';
import { categoriesService } from '@/lib/services/categories.service';

//===============================================================

type CategoriesStatus = 'idle' | 'loading' | 'success' | 'error';

type CategoriesState = {
  categories: WordCategory[];
  status: CategoriesStatus;
  fetchCategories: () => Promise<void>;
  reset: () => void;
};

//===============================================================

const initialState = {
  categories: [] as WordCategory[],
  status: 'idle' as CategoriesStatus,
};

//===============================================================

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  ...initialState,

  async fetchCategories() {
    const { status } = get();

    if (status === 'loading' || status === 'success') return;

    set({ status: 'loading' });

    try {
      const categories = await categoriesService.getCategories();

      set({
        categories,
        status: 'success',
      });
    } catch (error) {
      console.error(error);

      set({
        categories: [],
        status: 'error',
      });
    }
  },

  reset() {
    set(initialState);
  },
}));
