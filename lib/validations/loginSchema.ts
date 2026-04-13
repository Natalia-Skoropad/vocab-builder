import * as yup from 'yup';

import type { LoginFormValues } from '@/types/forms';
import { emailSchema, passwordSchema } from '@/lib/validations/commonFields';

//===============================================================

export const loginSchema: yup.ObjectSchema<LoginFormValues> = yup
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .required();
