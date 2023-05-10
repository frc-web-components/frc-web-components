/* eslint-disable @typescript-eslint/no-empty-function */
import WebbitStore, { Source } from '@webbitjs/store';

interface ViewProperty {
  value?: unknown;
  key?: string;
  provider?: string;
}

export default class SourceView {
  private onPropertyChangeCallbacks: Record<
    string,
    Map<symbol, () => unknown>
  > = {};
  private onChangeCallbacks: Map<symbol, () => unknown> = new Map();
  private unsubscribeCallbacks: Record<string, () => void> = {};

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private store: WebbitStore,
    private viewProperties: Record<string, ViewProperty>
  ) {
    Object.keys(viewProperties).forEach((property) => {
      this.onPropertyChangeCallbacks[property] = new Map();
      this.updateSubscriberCallback(property);
    });
  }

  getStore() {
    return this.store;
  }

  getProviderName(property: string): string | undefined {
    const { provider } = this.viewProperties[property];
    if (provider) {
      return provider;
    }
    return this.store.getDefaultSourceProvider();
  }

  getSource(property: string): Source | undefined {
    const { key } = this.viewProperties[property];
    const providerName = this.getProviderName(property);
    if (typeof key === 'string' && providerName) {
      return this.store.getSource(providerName, key);
    }
    return undefined;
  }

  getPropertyValues() {
    const valueEntries: [string, unknown][] = Object.entries(
      this.viewProperties
    ).map(([name, { key, value }]) => {
      if (typeof key !== 'string') {
        return [name, value];
      }

      const source = this.getSource(name);

      if (source?.hasValue()) {
        return [name, source.getSourceValue()];
      }

      return [name, value];
    });

    return Object.fromEntries(valueEntries);
  }

  private updateSubscriberCallback(property: string) {
    const { key } = this.viewProperties[property];
    const providerName = this.getProviderName(property);
    this.unsubscribeCallbacks[property]?.();
    this.unsubscribeCallbacks[property] = () => {};

    if (providerName && typeof key === 'string') {
      this.unsubscribeCallbacks[property] = this.store.subscribe(
        providerName,
        key,
        () => {
          this.notifyPropertyChangeCallbacks(property);
          this.notifyChangeCallbacks();
        },
        true
      );
    }
  }

  private notifyChangeCallbacks(): void {
    this.onChangeCallbacks.forEach((callback) => callback());
  }

  private notifyPropertyChangeCallbacks(property: string): void {
    const callbacks = this.onPropertyChangeCallbacks[property] ?? new Map();
    callbacks.forEach((callback) => callback());
  }

  onChange(callback: () => unknown, callImediately = false): () => unknown {
    const symbol = Symbol('view');
    this.onChangeCallbacks.set(symbol, callback);
    if (callImediately) {
      callback();
    }
    return () => {
      this.onChangeCallbacks.delete(symbol);
    };
  }

  onPropertyChange(
    property: string,
    callback: () => unknown,
    callImediately = false
  ): () => unknown {
    const symbol = Symbol('view');
    this.onPropertyChangeCallbacks[property].set(symbol, callback);
    if (callImediately) {
      callback();
    }
    return () => {
      this.onPropertyChangeCallbacks[property].delete(symbol);
    };
  }
}
