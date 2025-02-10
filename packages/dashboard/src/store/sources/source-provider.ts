import { store } from '@store/app/store';
import {
  PropertyType,
  setConnectionStatus,
  setSourceDisplayTypes,
  setSources,
} from '../slices/sourceSlice';

type SourceUpdate = {
  updateType: string;
  type?: string;
  propertyType?: PropertyType;
  value?: unknown;
};

type SourceUpdates = {
  [sourceKey: string]: {
    first: SourceUpdate;
    last?: SourceUpdate;
  };
};

class SourceProvider {
  #interval?;
  #sourceUpdates: SourceUpdates = {};
  #displayTypeUpdates: {
    [sourceKey: string]: string;
  } = {};
  #clearSourcesTimeoutId?: number; //NodeJS.Timeout;
  #clearSourcesHandlers: Map<symbol, () => void> = new Map();
  #provider: string;

  constructor(provider: string, interval = 0) {
    this.#provider = provider;
    if (interval) {
      this.#interval = setInterval(this.#sendUpdates.bind(this), interval);
    }
  }

  /**
   * Updates the value of a source in the store. If the source doesn't
   * exist then it is added. Should only be called internally by the
   * source provider.
   *
   * @protected
   * @param {string} key - The source's key. This is a string separated
   * by '/'.
   * @param {*} value - The new value.
   */
  update(
    key: string,
    value: unknown,
    type: string,
    propertyType: PropertyType,
  ): void {
    clearTimeout(this.#clearSourcesTimeoutId as unknown as number);

    if (this.#sourceUpdates[key] === undefined) {
      this.#sourceUpdates[key] = {
        first: {
          updateType: 'change',
          value,
          type,
          propertyType,
        },
      };
    } else {
      this.#sourceUpdates[key].last = {
        updateType: 'change',
        value,
        type,
        propertyType,
      };
    }

    if (!this.#interval) {
      this.#sendUpdates();
    }
  }

  updateDisplayType(key: string, type: string) {
    this.#displayTypeUpdates[key] = type;
  }

  /**
   * Removes an existing source from the store. If the source
   * doesn't exist this does nothing. Should only be called
   * internally by the source provider.
   *
   * @protected
   * @param {string} key - The source's key. This is a string separated
   * by '/'.
   */
  removeSource(key: string): void {
    if (this.#sourceUpdates[key] === undefined) {
      this.#sourceUpdates[key] = {
        first: {
          updateType: 'removal',
        },
      };
    } else {
      this.#sourceUpdates[key].last = {
        updateType: 'removal',
      };
    }

    if (!this.#interval) {
      this.#sendUpdates();
    }
  }

  /**
   * Removes all sources in the store for this provider. Should only be
   * called internally by the source provider.
   *
   * @protected
   * @param {function} callback - An optional callback. Called when sources
   * have been cleared.
   */
  clearSources(callback: () => void = () => {}): void {
    // send updates now to prevent them from being incorrectly sent after
    // sources were cleared.
    this.#sendUpdates(() => {
      this.#clearSourcesHandlers.forEach((listener) => listener());
      callback();
    });
  }

  /**
   * Removes all sources in the store for this provider after a period of time.
   * If a source is set or this function is called before that period of time
   * ends, sources will not be cleared. This is useful for preventing sources
   * from being cleared on an unreliable network. Should only be called internally
   * by the source provider.
   *
   * @protected
   * @param {number} timeout - The period of time before clearing the sources
   * in milliseconds.
   * @param {function} callback - An optional callback. Called when sources
   * have been cleared.
   */
  clearSourcesWithTimeout(timeout: number, callback: () => void): void {
    clearTimeout(this.#clearSourcesTimeoutId as unknown as number);
    this.#clearSourcesTimeoutId = setTimeout(() => {
      this.clearSources(callback);
    }, timeout) as any;
  }

  /**
   * Called when a source's value is modified by the user. This method
   * should be overridden by the child class to handle these updates.
   * This method should not be called directly.
   *
   * @protected
   * @param {string} key - The source's key. This is a string separated
   * by '/'.
   * @param {*} value - The source's updated value.
   */
  componentUpdate(key: string, value: unknown, type: string): void {
    console.log(key, value, type);
  }

  #sendUpdates(callback: () => unknown = () => {}): void {
    if (Object.keys(this.#sourceUpdates).length === 0) {
      callback();
      return;
    }

    const sourceUpdates = { ...this.#sourceUpdates };
    this.#sourceUpdates = {};

    // send first updates then last
    const firstUpdates: Record<string, SourceUpdate> = {};
    const lastUpdates: Record<string, SourceUpdate> = {};

    Object.entries(sourceUpdates).forEach(([key, values]) => {
      firstUpdates[key] = values.first;
      if (typeof values.last !== 'undefined') {
        lastUpdates[key] = values.last;
      }
    });

    this.#sendChanges(firstUpdates);
    this.#sendRemovals(firstUpdates);

    if (Object.keys(lastUpdates).length > 0) {
      setTimeout(() => {
        this.#sendChanges(lastUpdates);
        this.#sendRemovals(lastUpdates);
        callback();
      });
    } else {
      callback();
    }
  }

  #sendChanges(updates: { [key: string]: SourceUpdate }): void {
    const changes: Record<string, SourceUpdate> = {};
    Object.entries(updates).forEach(([key, { updateType }]) => {
      if (updateType === 'change') {
        changes[key] = updates[key];
      }
    });
    if (Object.keys(changes).length > 0) {
      // dispatch action from store
      const sources = Object.entries(changes).map(
        ([key, { value, propertyType, type }]) => {
          return {
            key,
            value,
            provider: this.#provider,
            type: type!,
            propertyType: propertyType!,
          };
        },
      );
      store.dispatch(setSources(sources));
    }
    if (Object.keys(this.#displayTypeUpdates).length > 9) {
      const updates = Object.entries(this.#displayTypeUpdates).map(
        ([key, type]) => {
          return {
            key,
            type,
            provider: this.#provider,
          };
        },
      );
      store.dispatch(setSourceDisplayTypes(updates));
    }
  }

  #sendRemovals(updates: { [key: string]: SourceUpdate }): void {
    const removals: Array<string> = [];
    Object.entries(updates).forEach(([key, { updateType }]) => {
      if (updateType === 'removal') {
        removals.push(key);
      }
    });
    if (removals.length > 0) {
      // this.#sourcesRemovedHandlers.forEach((listener) => listener(removals));
    }
  }

  addClearSourcesHandler(handler: () => unknown): () => void {
    const symbol = Symbol('clearSources');
    this.#clearSourcesHandlers.set(symbol, handler);
    return () => {
      this.#clearSourcesHandlers.delete(symbol);
    };
  }

  disconnect(): void {
    clearTimeout(this.#interval);
  }

  setConnectionStatus(connected: boolean, label: string) {
    store.dispatch(
      setConnectionStatus({
        provider: this.#provider,
        connected,
        label,
      }),
    );
  }
}

export default SourceProvider;
