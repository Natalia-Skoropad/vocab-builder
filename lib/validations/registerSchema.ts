import * as yup from 'yup';

import type { RegisterFormValues } from '@/types/forms';

import {
  nameSchema,
  emailSchema,
  passwordSchema,
} from '@/lib/validations/commonFields';

//===============================================================

export const registerSchema: yup.ObjectSchema<RegisterFormValues> = yup
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  })
  .required();
