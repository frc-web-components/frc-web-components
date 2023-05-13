import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import Store from '@webbitjs/store';

class SourceValue extends AsyncDirective {
  static getSourceValue(
    store: Store,
    provider: string,
    key: string,
    defaultValue: unknown
  ): unknown {
    const source = store.getSource(provider, key);
    if (source?.hasValue()) {
      return source.getValue();
    }
    return defaultValue;
  }

  render(store: Store, provider: string, key: string, defaultValue: unknown) {
    store.subscribe(
      provider,
      key,
      () => {
        this.setValue(
          SourceValue.getSourceValue(store, provider, key, defaultValue)
        );
      },
      false
    );
    return SourceValue.getSourceValue(store, provider, key, defaultValue);
  }
}

export const sourceValue = directive(SourceValue);

export const ntValueDirective =
  (store: Store) => (key: string, defaultValue: unknown) =>
    sourceValue(store, 'NetworkTables', key, defaultValue);
