import * as yup from 'yup';

import {
  EN_WORD_PATTERN,
  UA_WORD_PATTERN,
} from '@/lib/validations/wordPatterns';

//===============================================================

const WORD_MIN = 1;
const WORD_MAX = 60;

//===============================================================

export const WORD_LIMITS = {
  MIN: WORD_MIN,
  MAX: WORD_MAX,
};

export const uaWordField = yup
  .string()
  .trim()
  .min(WORD_MIN, 'Enter at least 1 character')
  .max(WORD_MAX, `Maximum ${WORD_MAX} characters`)
  .matches(UA_WORD_PATTERN, 'Enter a valid Ukrainian word')
  .required('Enter a valid Ukrainian word');

export const enWordField = yup
  .string()
  .trim()
  .min(WORD_MIN, 'Enter at least 1 character')
  .max(WORD_MAX, `Maximum ${WORD_MAX} characters`)
  .matches(EN_WORD_PATTERN, 'Enter a valid English word')
  .required('Enter a valid English word');
