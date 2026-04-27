'use client';

import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';

import type { EditWordFormValues } from '@/types/forms';
import type { WordItem } from '@/types/word';
import { setFormValueWithMeta } from '@/lib/forms/setWordFormValue';
import { wordsService } from '@/lib/services/words.service';
import { editWordSchema } from '@/lib/validations/editWordSchema';

import {
  handleWordsMutationError,
  handleWordsMutationSuccess,
  invalidateDictionaryDashboardQueries,
} from '@/lib/words/mutation-helpers';

import WordFormActions from '@/components/words/WordFormActions/WordFormActions';

import WordFormFieldRow, {
  type FeedbackState,
} from '@/components/words/WordFormFieldRow/WordFormFieldRow';

import css from '@/components/words/shared/WordForm.module.css';

//===============================================================

type Props = {
  word: WordItem;
  onClose: () => void;
};

//===============================================================

function EditWordForm({ word, onClose }: Props) {
  const queryClient = useQueryClient();

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<EditWordFormValues>({
    resolver: yupResolver(editWordSchema),
    mode: 'onChange',
    defaultValues: {
      ua: word.ua,
      en: word.en,
    },
  });

  const uaValue = useWatch({ control, name: 'ua', defaultValue: word.ua });
  const enValue = useWatch({ control, name: 'en', defaultValue: word.en });

  useEffect(() => {
    reset({ ua: word.ua, en: word.en });
  }, [reset, word.ua, word.en]);

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
      await handleWordsMutationSuccess({
        queryClient,
        fallbackMessage: 'Word updated successfully.',
        invalidate: invalidateDictionaryDashboardQueries,
        onAfterSuccess: onClose,
      });
    },
    onError: (error) => {
      handleWordsMutationError({
        error,
        fallbackMessage: 'Failed to edit word.',
      });
    },
  });

  const onSubmit = async (values: EditWordFormValues) => {
    await editMutation.mutateAsync(values);
  };

  const isSaveDisabled =
    isSubmitting ||
    editMutation.isPending ||
    !uaValue.trim() ||
    !enValue.trim() ||
    !isValid;

  const uaHasSuccess =
    touchedFields.ua && uaValue.trim().length > 0 && !errors.ua?.message;

  const enHasSuccess =
    touchedFields.en && enValue.trim().length > 0 && !errors.en?.message;

  const uaState: FeedbackState = errors.ua?.message
    ? 'error'
    : uaHasSuccess
    ? 'success'
    : 'default';

  const enState: FeedbackState = errors.en?.message
    ? 'error'
    : enHasSuccess
    ? 'success'
    : 'default';

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={css.wordsGroup}>
        <WordFormFieldRow
          name="ua"
          value={uaValue}
          placeholder="Трохи, трішки"
          iconName="icon-ukraine-flag"
          languageLabel="Ukrainian"
          state={uaState}
          errorText={errors.ua?.message}
          successText="Looks good"
          onChange={(value) => setFormValueWithMeta(setValue, 'ua', value)}
        />

        <WordFormFieldRow
          name="en"
          value={enValue}
          placeholder="A little bit"
          iconName="icon-united-kingdom-flag"
          languageLabel="English"
          state={enState}
          errorText={errors.en?.message}
          successText="Looks good"
          onChange={(value) => setFormValueWithMeta(setValue, 'en', value)}
        />
      </div>

      <WordFormActions
        submitLabel={editMutation.isPending ? 'Saving...' : 'Save'}
        onCancel={onClose}
        isSubmitDisabled={isSaveDisabled}
        isBusy={editMutation.isPending || isSubmitting}
      />
    </form>
  );
}

export default EditWordForm;
