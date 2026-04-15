import * as yup from 'yup';
import { enWordField, uaWordField } from './wordFields';

export const addWordSchema = yup.object({
  category: yup.string().required('Category is required'),
  isIrregular: yup.boolean().default(false),
  ua: uaWordField,
  en: enWordField,
});
