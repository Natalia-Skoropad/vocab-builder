import * as yup from 'yup';

//===============================================================

const WORD_MIN = 1;
const WORD_MAX = 60;

const EN_REGEX = /^[A-Za-z'-]+(?:\s+[A-Za-z'-]+)*$/;
const UA_REGEX = /^(?![A-Za-z])[А-ЯІЄЇҐґа-яієїʼ'`\-\s]+$/u;

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
  .matches(UA_REGEX, 'Enter a valid Ukrainian word')
  .required('Enter a valid Ukrainian word');

export const enWordField = yup
  .string()
  .trim()
  .min(WORD_MIN, 'Enter at least 1 character')
  .max(WORD_MAX, `Maximum ${WORD_MAX} characters`)
  .matches(EN_REGEX, 'Enter a valid English word')
  .required('Enter a valid English word');
