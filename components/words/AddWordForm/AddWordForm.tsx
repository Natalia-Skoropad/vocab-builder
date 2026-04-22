'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';

import type { AddWordFormValues } from '@/types/forms';
import { ROUTES } from '@/lib/constants/routes';
import { wordsService } from '@/lib/services/words.service';
import { setFormValueWithMeta } from '@/lib/forms/setWordFormValue';
import { addWordSchema } from '@/lib/validations/addWordSchema';
import { useCategoriesStore } from '@/store/categories/categoriesStore';

import {
  handleWordsMutationError,
  handleWordsMutationSuccess,
  invalidateDictionaryDashboardQueries,
} from '@/lib/words/mutation-helpers';

import CustomSelect from '@/components/common/CustomSelect/CustomSelect';
import WordFormActions from '@/components/words/WordFormActions/WordFormActions';

import RadioGroup, {
  type RadioOption,
} from '@/components/common/RadioGroup/RadioGroup';

import WordFormFieldRow, {
  type FeedbackState,
} from '@/components/words/WordFormFieldRow/WordFormFieldRow';

import css from '@/components/words/shared/WordForm.module.css';

//===============================================================

type Props = {
  onClose: () => void;
};

const baseVerbOptions: RadioOption[] = [
  { value: 'regular', label: 'Regular' },
  { value: 'irregular', label: 'Irregular' },
];

//===============================================================

function AddWordForm({ onClose }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const categories = useCategoriesStore((state) => state.categories);
  const isLoaded = useCategoriesStore((state) => state.isLoaded);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  useEffect(() => {
    if (isLoaded) return;
    void fetchCategories().catch(() => null);
  }, [fetchCategories, isLoaded]);

  const {
    control,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<AddWordFormValues>({
    resolver: yupResolver(addWordSchema),
    mode: 'onChange',
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

  const uaValue = useWatch({ control, name: 'ua', defaultValue: '' });
  const enValue = useWatch({ control, name: 'en', defaultValue: '' });

  const isVerb = selectedCategory === 'verb';

  useEffect(() => {
    if (!isVerb) {
      setValue('isIrregular', false, { shouldValidate: true });
    }
  }, [isVerb, setValue]);

  const createMutation = useMutation({
    mutationFn: wordsService.createWord,
    onSuccess: async () => {
      await handleWordsMutationSuccess({
        queryClient,
        fallbackMessage: 'Word added successfully.',
        invalidate: invalidateDictionaryDashboardQueries,
        onAfterSuccess: async () => {
          onClose();

          router.push(ROUTES.DICTIONARY, {
            scroll: false,
          });
        },
      });
    },
    onError: (error) => {
      handleWordsMutationError({
        error,
        fallbackMessage: 'Failed to create word.',
      });
    },
  });

  const categoryOptions = useMemo(
    () =>
      categories.map((item) => ({
        value: item,
        label: item.charAt(0).toUpperCase() + item.slice(1),
      })),
    [categories]
  );

  const verbOptions = useMemo<RadioOption[]>(
    () =>
      baseVerbOptions.map((option) => ({
        ...option,
        disabled: !isVerb,
      })),
    [isVerb]
  );

  const onSubmit = async (values: AddWordFormValues) => {
    await createMutation.mutateAsync(values);
  };

  const isAddDisabled =
    isSubmitting ||
    createMutation.isPending ||
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
      <div className={css.topGroup}>
        <CustomSelect
          value={selectedCategory}
          options={categoryOptions}
          onChange={(nextValue) => {
            setFormValueWithMeta(setValue, 'category', nextValue);
            void trigger('category');
          }}
          variant="modal"
          className={css.categorySelect}
        />

        <div
          className={`${css.verbGroup} ${!isVerb ? css.verbGroupDisabled : ''}`}
          aria-disabled={!isVerb}
        >
          <RadioGroup
            name="add-word-verb-type"
            value={isIrregular ? 'irregular' : 'regular'}
            options={verbOptions}
            onChange={(nextValue) => {
              if (!isVerb) return;

              setValue('isIrregular', nextValue === 'irregular', {
                shouldValidate: true,
              });
            }}
            variant="light"
            className={css.radioGroup}
            ariaLabel="Verb type"
          />

          <div className={css.feedbackSlot}>
            {isVerb && isIrregular ? (
              <p className={css.hintText}>
                Such data must be entered in the format I form-II form-III form.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className={css.wordsGroup}>
        <WordFormFieldRow
          name="ua"
          value={uaValue}
          placeholder="Працювати"
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
          placeholder="Work"
          iconName="icon-united-kingdom-flag"
          languageLabel="English"
          state={enState}
          errorText={errors.en?.message}
          successText="Looks good"
          onChange={(value) => setFormValueWithMeta(setValue, 'en', value)}
        />
      </div>

      <WordFormActions
        submitLabel={createMutation.isPending ? 'Adding...' : 'Add'}
        onCancel={onClose}
        isSubmitDisabled={isAddDisabled}
        isBusy={createMutation.isPending || isSubmitting}
      />
    </form>
  );
}

export default AddWordForm;
