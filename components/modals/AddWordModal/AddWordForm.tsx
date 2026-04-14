'use client';

import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import type { AddWordFormValues } from '@/types/forms';
import { addWordSchema } from '@/lib/validations/addWordSchema';
import { wordsService } from '@/lib/services/words.service';
import { useCategoriesStore } from '@/store/categories/categoriesStore';

import Button from '@/components/common/Button/Button';

import css from './AddWordForm.module.css';

//===============================================================

type Props = {
  onClose: () => void;
};

//===============================================================

function AddWordForm({ onClose }: Props) {
  const queryClient = useQueryClient();

  const categories = useCategoriesStore((state) => state.categories);
  const isLoaded = useCategoriesStore((state) => state.isLoaded);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  useEffect(() => {
    if (isLoaded) return;
    void fetchCategories().catch(() => null);
  }, [fetchCategories, isLoaded]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddWordFormValues>({
    resolver: yupResolver(addWordSchema),
    defaultValues: {
      category: 'verb',
      isIrregular: false,
      ua: '',
      en: '',
    },
  });

  const selectedCategory = useWatch({
    control,
    name: 'category',
    defaultValue: 'verb',
  });

  const isIrregular = useWatch({
    control,
    name: 'isIrregular',
    defaultValue: false,
  });

  const isVerb = selectedCategory === 'verb';

  useEffect(() => {
    if (!isVerb) {
      setValue('isIrregular', false, { shouldValidate: true });
    }
  }, [isVerb, setValue]);

  const createMutation = useMutation({
    mutationFn: wordsService.createWord,
    onSuccess: async () => {
      toast.success('Word added successfully.');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['dictionary-words'] }),
        queryClient.invalidateQueries({ queryKey: ['words-statistics'] }),
      ]);

      onClose();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create word.'
      );
    },
  });

  const onSubmit = async (values: AddWordFormValues) => {
    await createMutation.mutateAsync(values);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={css.fields}>
        <div className={css.control}>
          <select className={css.select} {...register('category')}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
          {errors.category ? (
            <span className={css.error}>{errors.category.message}</span>
          ) : null}
        </div>

        {isVerb ? (
          <fieldset className={css.radioGroup}>
            <label className={css.radioLabel}>
              <input
                type="radio"
                checked={!isIrregular}
                onChange={() =>
                  setValue('isIrregular', false, { shouldValidate: true })
                }
              />
              <span>Regular</span>
            </label>

            <label className={css.radioLabel}>
              <input
                type="radio"
                checked={isIrregular}
                onChange={() =>
                  setValue('isIrregular', true, { shouldValidate: true })
                }
              />
              <span>Irregular</span>
            </label>
          </fieldset>
        ) : null}

        <div className={css.control}>
          <input
            type="text"
            placeholder="Українською"
            className={css.input}
            {...register('ua')}
          />
          {errors.ua ? (
            <span className={css.error}>{errors.ua.message}</span>
          ) : null}
        </div>

        <div className={css.control}>
          <input
            type="text"
            placeholder="English"
            className={css.input}
            {...register('en')}
          />
          {errors.en ? (
            <span className={css.error}>{errors.en.message}</span>
          ) : null}
        </div>
      </div>

      <div className={css.actions}>
        <Button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting || createMutation.isPending}
        >
          {createMutation.isPending ? 'Adding...' : 'Add'}
        </Button>

        <Button
          type="button"
          variant="registration"
          className={css.cancelButton}
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default AddWordForm;
