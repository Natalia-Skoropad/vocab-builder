'use client';

import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import type { EditWordFormValues } from '@/types/forms';
import type { WordItem } from '@/types/word';
import { editWordSchema } from '@/lib/validations/editWordSchema';
import { wordsService } from '@/lib/services/words.service';

import Button from '@/components/common/Button/Button';
import LanguageBadge from '@/components/common/LanguageBadge/LanguageBadge';
import SvgIcon from '@/components/common/SvgIcon/SvgIcon';

import css from '@/components/modals/shared/WordForm.module.css';

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
      toast.success('Word updated successfully.');
      await queryClient.invalidateQueries({ queryKey: ['dictionary-words'] });
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

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
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
              placeholder="Трохи, трішки"
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
              placeholder="A little bit"
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
          disabled={isSaveDisabled}
          variant={isSaveDisabled ? 'disabled' : 'light'}
          fullWidth={false}
        >
          {editMutation.isPending ? 'Saving...' : 'Save'}
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

export default EditWordForm;
