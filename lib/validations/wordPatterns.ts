export const EN_WORD_PATTERN = /^[A-Za-z'-]+(?:\s+[A-Za-z'-]+)*$/;

export const UA_WORD_PATTERN = /^(?![A-Za-z])[А-ЯІЄЇҐґа-яієїʼ'`\-\s]+$/u;

//===============================================================

export function isValidEnglishWord(value: string): boolean {
  return EN_WORD_PATTERN.test(value);
}

export function isValidUkrainianWord(value: string): boolean {
  return UA_WORD_PATTERN.test(value);
}
