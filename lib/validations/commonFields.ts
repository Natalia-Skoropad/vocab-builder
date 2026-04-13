import * as yup from 'yup';

//===============================================================

const EMAIL_REGEX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/;

//===============================================================

export const nameSchema = yup.string().trim().required('Name is required');

export const emailSchema = yup
  .string()
  .trim()
  .matches(EMAIL_REGEX, 'Enter a valid email')
  .required('Email is required');

export const passwordSchema = yup
  .string()
  .trim()
  .matches(
    PASSWORD_REGEX,
    'Password must contain 6 English letters and 1 number'
  )
  .required('Password is required');
