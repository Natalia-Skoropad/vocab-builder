import { create } from 'zustand';

import type { WordCategory } from '@/types/word';
import { categoriesService } from '@/lib/services/categories.service';

//===============================================================

type CategoriesState = {
  categories: WordCategory[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
};

//===============================================================

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  fetchCategories: async () => {
    const { isLoading, isLoaded } = get();

    if (isLoading || isLoaded) return;

    set({
      isLoading: true,
      error: null,
    });

    try {
      const categories = await categoriesService.getCategories();

      set({
        categories,
        isLoading: false,
        isLoaded: true,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        isLoaded: false,
        error:
          error instanceof Error ? error.message : 'Failed to load categories.',
      });

      throw error;
    }
  },
}));
