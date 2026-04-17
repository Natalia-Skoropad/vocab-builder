import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseFormSetValue,
} from 'react-hook-form';

//===============================================================

const DEFAULT_SET_VALUE_OPTIONS = {
  shouldValidate: true,
  shouldTouch: true,
  shouldDirty: true,
};

//===============================================================

export function setFormValueWithMeta<TFieldValues extends FieldValues>(
  setValue: UseFormSetValue<TFieldValues>,
  name: FieldPath<TFieldValues>,
  value: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
) {
  setValue(name, value, DEFAULT_SET_VALUE_OPTIONS);
}
