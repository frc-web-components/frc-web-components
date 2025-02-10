import { useState } from 'react';
import useKeyListener from './useKeyListener';
import { useNt4 } from './NT4Provider';

export function useJson<T>(
  key: string,
  defaultValue: T,
  useCamelCase = true,
): T {
  const { store } = useNt4();

  const [value, setValue] = useState<T>(defaultValue);

  useKeyListener<T>(
    key,
    () => {
      const json = store.getSource('NetworkTables', key)?.getJson(useCamelCase);
      setValue(json as T);
    },
    true,
  );

  return value;
}

export default useJson;
