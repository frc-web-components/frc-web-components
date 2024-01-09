interface KeyStoreTree<T> {
  [key: string]: KeyStoreTree<T> | T;
}

interface StoreEntry<T> {
  key: string;
  value?: T;
  parent?: StoreEntry<T>;
  children: Record<string, StoreEntry<T>>;
}

export class KeyValueStore<T> {
  #values: Record<string, StoreEntry<T>> = {};

  set(key: string, value: T): void {
    const keyParts = key.split('/');
    let currentKey = '';
    let currentEntry: StoreEntry<T> | undefined;
    keyParts.forEach((keyPart) => {
      currentKey += keyPart;
      if (!(currentKey in this.#values)) {
        this.#values[currentKey] = {
          key: currentKey,
          parent: currentEntry,
          children: {},
        };
        if (currentEntry) {
          currentEntry.children[keyPart] = this.#values[currentKey];
        }
      }
      currentEntry = this.#values[currentKey];
      currentKey += '/';
    });
    if (currentEntry) {
      currentEntry.value = value;
    }
  }

  static isEmpty(entry: StoreEntry<unknown>): boolean {
    return (
      entry.value === undefined && Object.keys(entry.children).length === 0
    );
  }

  #cleanup(key: string): void {
    const entry = this.#values[key];
    Object.entries(entry.children).forEach(([childKey, childEntry]) => {
      if (KeyValueStore.isEmpty(childEntry)) {
        delete entry.children[childKey];
      }
    });
    if (!KeyValueStore.isEmpty(entry)) {
      return;
    }
    delete this.#values[key];
    if (entry.parent) {
      this.#cleanup(entry.parent.key);
    }
  }

  delete(key: string): void {
    delete this.#values[key].value;
    this.#cleanup(key);
  }

  get(key: string): T | undefined {
    return this.#values[key]?.value;
  }

  has(key: string): boolean {
    return this.#values[key]?.value !== undefined;
  }

  getJson(key: string): KeyStoreTree<T> | T | undefined {
    const entry = this.#values[key];

    if (!entry) {
      return undefined;
    }

    if (Object.keys(entry.children).length === 0) {
      return entry.value;
    }

    const json: KeyStoreTree<T> = {};

    Object.entries(entry.children).forEach(([childKey, childEntry]) => {
      const childJson = this.getJson(childEntry.key);
      if (childJson) {
        json[childKey] = childJson;
      }
    });

    return json;
  }
}
