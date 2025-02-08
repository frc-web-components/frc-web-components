import { useEffect } from 'react';
import { useNt4 } from './NT4Provider';

function useKeyListener<T>(
  key: string,
  callback: (key: string, value: T) => unknown,
  immediateNotify: boolean,
) {
  const { store } = useNt4();

  useEffect(() => {
    return store.subscribe(
      'NetworkTables',
      key,
      (value: unknown) => {
        callback(key, value as T);
      },
      immediateNotify,
    );
  }, []);
}

export default useKeyListener;
