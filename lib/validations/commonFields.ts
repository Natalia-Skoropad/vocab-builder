import * as yup from 'yup';

//===============================================================

const EMAIL_REGEX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/;

//===============================================================

export const AUTH_NAME_MAX_LENGTH = 32;
export const AUTH_EMAIL_MAX_LENGTH = 64;
export const AUTH_PASSWORD_MAX_LENGTH = 7;

//===============================================================

export const nameSchema = yup
  .string()
  .trim()
  .max(
    AUTH_NAME_MAX_LENGTH,
    `Name must be at most ${AUTH_NAME_MAX_LENGTH} characters`
  )
  .required('Name is required');

export const emailSchema = yup
  .string()
  .trim()
  .max(
    AUTH_EMAIL_MAX_LENGTH,
    `Email must be at most ${AUTH_EMAIL_MAX_LENGTH} characters`
  )
  .matches(EMAIL_REGEX, 'Enter a valid email')
  .required('Email is required');

export const passwordSchema = yup
  .string()
  .trim()
  .max(
    AUTH_PASSWORD_MAX_LENGTH,
    `Password must be at most ${AUTH_PASSWORD_MAX_LENGTH} characters`
  )
  .matches(
    PASSWORD_REGEX,
    'Password must contain 6 English letters and 1 number'
  )
  .required('Password is required');
