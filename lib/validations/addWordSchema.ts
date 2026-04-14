import * as yup from 'yup';

import type { AddWordFormValues } from '@/types/forms';

import {
  wordValidationFields,
  baseWordPairShape,
} from '@/lib/validations/wordFields';

//===============================================================

export const addWordSchema: yup.ObjectSchema<AddWordFormValues> = yup
  .object({
    category: wordValidationFields.category,
    isIrregular: wordValidationFields.isIrregular,
    ...baseWordPairShape,
  })
  .required();
