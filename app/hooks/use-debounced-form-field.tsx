import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useFormStore } from '~/hooks/use-form-store';
import type { FormData } from '~/types';

type UseDebouncedFormFieldOptions = {
  field: keyof FormData;
  initialValue?: string;
  debounce?: number;
  id?: string;
  subField?: string;
};

export const useDebouncedFormField = ({
  field,
  initialValue = '',
  debounce = 1000,
  id,
  subField,
}: UseDebouncedFormFieldOptions) => {
  const updateField = useFormStore((state) => state.updateField);
  const [localValue, setLocalValue] = useState(initialValue);
  const [debouncedValue] = useDebounce(localValue, debounce);

  useEffect(() => {
    updateField(field, debouncedValue, id, subField);
  }, [debouncedValue]);

  return [localValue, setLocalValue] as const;
};
