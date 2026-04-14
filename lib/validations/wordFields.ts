import * as yup from 'yup';

//===============================================================

const EN_REGEX = /\b[A-Za-z'-]+(?:\s+[A-Za-z'-]+)*\b/;
const UA_REGEX = /^(?![A-Za-z])[А-ЯІЄЇҐґа-яієїʼ\s]+$/u;

//===============================================================

export const wordValidationFields = {
  category: yup.string().trim().required('Category is required'),

  isIrregular: yup.boolean().required(),

  ua: yup
    .string()
    .trim()
    .matches(UA_REGEX, 'Enter a valid Ukrainian word')
    .required('Translation is required'),

  en: yup
    .string()
    .trim()
    .matches(EN_REGEX, 'Enter a valid English word')
    .required('Word is required'),
};

//===============================================================

export const baseWordPairShape = {
  ua: wordValidationFields.ua,
  en: wordValidationFields.en,
};
