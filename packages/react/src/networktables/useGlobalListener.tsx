import { useEffect } from 'react';
import { useNt4 } from './NT4Provider';

function useGlobalListener(
  callback: (key: string, value: unknown) => unknown,
  immediateNotify: boolean,
) {
  const { store } = useNt4();

  useEffect(() => {
    return store.subscribeAll(
      'NetworkTables',
      (value: unknown, key: string) => {
        callback(key, value);
      },
      immediateNotify,
    );
  }, []);
}

export default useGlobalListener;
