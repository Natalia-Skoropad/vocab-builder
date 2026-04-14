export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

//===============================================================

export type AddWordFormValues = {
  category: string;
  isIrregular: boolean;
  ua: string;
  en: string;
};

export type EditWordFormValues = {
  ua: string;
  en: string;
};
