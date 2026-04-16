import * as yup from 'yup';
import { enWordField, uaWordField } from './wordFields';

//===============================================================

export const editWordSchema = yup.object({
  ua: uaWordField,
  en: enWordField,
});
