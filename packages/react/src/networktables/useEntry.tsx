import { useState, useCallback } from 'react';
import useKeyListener from './useKeyListener';
import { useNt4 } from './NT4Provider';

export function useEntry<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const { nt4Provider } = useNt4();

  const [value, setValue] = useState<T>(defaultValue);

  const updateNtValue = useCallback((newValue: unknown) => {
    nt4Provider.userUpdate(key, newValue);
  }, []);

  useKeyListener<T>(
    key,
    (_, newValue) => {
      if (newValue === undefined) {
        setValue(defaultValue);
      } else {
        setValue(newValue);
      }
    },
    true,
  );

  return [value, updateNtValue];
}

export default useEntry;
