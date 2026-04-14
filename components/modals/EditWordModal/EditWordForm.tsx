'use client';

import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import type { EditWordFormValues } from '@/types/forms';
import type { WordItem } from '@/types/word';
import { editWordSchema } from '@/lib/validations/editWordSchema';
import { wordsService } from '@/lib/services/words.service';

import Button from '@/components/common/Button/Button';

import css from './EditWordForm.module.css';

//===============================================================

type Props = {
  word: WordItem;
  onClose: () => void;
};

//===============================================================

function EditWordForm({ word, onClose }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditWordFormValues>({
    resolver: yupResolver(editWordSchema),
    defaultValues: {
      ua: word.ua,
      en: word.en,
    },
  });

  useEffect(() => {
    reset({
      ua: word.ua,
      en: word.en,
    });
  }, [reset, word.en, word.ua]);

  const editMutation = useMutation({
    mutationFn: (values: EditWordFormValues) =>
      wordsService.editWord({
        id: word._id,
        ua: values.ua,
        en: values.en,
        category: word.category,
        isIrregular: word.isIrregular,
      }),
    onSuccess: async () => {
      toast.success('Word updated successfully.');

      await queryClient.invalidateQueries({
        queryKey: ['dictionary-words'],
      });

      onClose();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to edit word.'
      );
    },
  });

  const onSubmit = async (values: EditWordFormValues) => {
    await editMutation.mutateAsync(values);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={css.fields}>
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
          disabled={isSubmitting || editMutation.isPending}
        >
          {editMutation.isPending ? 'Saving...' : 'Save'}
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

export default EditWordForm;
