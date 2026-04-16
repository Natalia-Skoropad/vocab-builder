'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ROUTES } from '@/lib/constants/routes';

import type { AddWordFormValues } from '@/types/forms';
import { addWordSchema } from '@/lib/validations/addWordSchema';
import { wordsService } from '@/lib/services/words.service';
import { useCategoriesStore } from '@/store/categories/categoriesStore';

import Button from '@/components/common/Button/Button';
import CustomSelect from '@/components/common/CustomSelect/CustomSelect';
import LanguageBadge from '@/components/common/LanguageBadge/LanguageBadge';

import RadioGroup, {
  type RadioOption,
} from '@/components/common/RadioGroup/RadioGroup';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';
import css from '@/components/modals/shared/WordForm.module.css';

//===============================================================

type Props = {
  onClose: () => void;
};

const verbOptions: RadioOption[] = [
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
      toast.success('Word added successfully.');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['dictionary-words'] }),
        queryClient.invalidateQueries({ queryKey: ['words-statistics'] }),
      ]);

      onClose();

      router.push(ROUTES.DICTIONARY, {
        scroll: false,
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create word.'
      );
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

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={css.topGroup}>
        <CustomSelect
          value={selectedCategory}
          options={categoryOptions}
          onChange={(nextValue) => {
            setValue('category', nextValue, { shouldValidate: true });
            void trigger('category');
          }}
          variant="modal"
          className={css.categorySelect}
        />

        {isVerb ? (
          <div className={css.verbGroup}>
            <RadioGroup
              name="add-word-verb-type"
              value={isIrregular ? 'irregular' : 'regular'}
              options={verbOptions}
              onChange={(nextValue) =>
                setValue('isIrregular', nextValue === 'irregular', {
                  shouldValidate: true,
                })
              }
              variant="light"
              className={css.radioGroup}
              ariaLabel="Verb type"
            />

            <div className={css.feedbackSlot}>
              {isIrregular ? (
                <p className={css.hintText}>
                  Such data must be entered in the format I form-II form-III
                  form.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className={css.wordsGroup}>
        <div className={css.wordRow}>
          <label className={css.inputWrap}>
            <input
              type="text"
              value={uaValue}
              onChange={(event) =>
                setValue('ua', event.target.value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              placeholder="Працювати"
              maxLength={60}
              className={css.input}
              data-state={
                errors.ua?.message
                  ? 'error'
                  : uaHasSuccess
                  ? 'success'
                  : 'default'
              }
            />
          </label>

          <LanguageBadge
            iconName="icon-ukraine-flag"
            label="Ukrainian"
            className={css.langBadge}
          />

          <div className={css.feedbackSlot}>
            {errors.ua?.message ? (
              <p className={css.feedbackError}>
                <SvgIcon
                  name="icon-error-warning-fill"
                  className={css.feedbackIcon}
                  size={16}
                />
                <span>{errors.ua.message}</span>
              </p>
            ) : uaHasSuccess ? (
              <p className={css.feedbackSuccess}>
                <SvgIcon
                  name="icon-checkbox-circle-fill"
                  className={css.feedbackIcon}
                  size={16}
                />
                <span>Looks good</span>
              </p>
            ) : null}
          </div>
        </div>

        <div className={css.wordRow}>
          <label className={css.inputWrap}>
            <input
              type="text"
              value={enValue}
              onChange={(event) =>
                setValue('en', event.target.value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              placeholder="Work"
              maxLength={60}
              className={css.input}
              data-state={
                errors.en?.message
                  ? 'error'
                  : enHasSuccess
                  ? 'success'
                  : 'default'
              }
            />
          </label>

          <LanguageBadge
            iconName="icon-united-kingdom-flag"
            label="English"
            className={css.langBadge}
          />

          <div className={css.feedbackSlot}>
            {errors.en?.message ? (
              <p className={css.feedbackError}>
                <SvgIcon
                  name="icon-error-warning-fill"
                  className={css.feedbackIcon}
                  size={16}
                />
                <span>{errors.en.message}</span>
              </p>
            ) : enHasSuccess ? (
              <p className={css.feedbackSuccess}>
                <SvgIcon
                  name="icon-checkbox-circle-fill"
                  className={css.feedbackIcon}
                  size={16}
                />
                <span>Looks good</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className={css.actions}>
        <Button
          type="submit"
          disabled={isAddDisabled}
          variant={isAddDisabled ? 'disabled' : 'light'}
          fullWidth={false}
        >
          {createMutation.isPending ? 'Adding...' : 'Add'}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          fullWidth={false}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default AddWordForm;
