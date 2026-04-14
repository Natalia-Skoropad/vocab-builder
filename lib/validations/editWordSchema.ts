import * as yup from 'yup';

import type { EditWordFormValues } from '@/types/forms';
import { baseWordPairShape } from '@/lib/validations/wordFields';

//===============================================================

export const editWordSchema: yup.ObjectSchema<EditWordFormValues> = yup
  .object({
    ...baseWordPairShape,
  })
  .required();
