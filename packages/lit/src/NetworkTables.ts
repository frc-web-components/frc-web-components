import { createContext } from '@lit/context';
import { Nt4Provider } from '@frc-web-components/fwc/source-providers';
import { Store } from '@webbitjs/store';
import { ntValueDirective, SourceValue } from './directives';
import { DirectiveResult } from 'lit/directive.js';

export class NetworkTables {
  private store = new Store();
  private provider = new Nt4Provider();
  private nt4Directive = ntValueDirective(this.store);

  constructor(address: string) {
    this.store.addSourceProvider('NetworkTables', this.provider);
    this.store.setDefaultSourceProvider('NetworkTables');
    this.provider.connect(address);
  }

  getValue<T>(key: string, defaultValue: T): T {
    if (!this.store.getSource('NetworkTables', key)?.hasValue()) {
      return defaultValue;
    }
    return this.store.getSourceValue('NetworkTables', key) as T;
  }

  setValue(key: string, value: unknown) {
    this.provider.userUpdate(key, value);
  }

  addKeyListener<T>(
    key: string,
    callback: (key: string, value: T) => unknown,
    immediateNotify: boolean,
  ) {
    return this.store.subscribe(
      'NetworkTables',
      key,
      (value: unknown) => {
        callback(key, value as T);
      },
      immediateNotify,
    );
  }

  addGlobalListener(
    callback: (key: string, value: unknown) => unknown,
    immediateNotify: boolean,
  ) {
    return this.store.subscribeAll(
      'NetworkTables',
      (value: unknown, key: string) => {
        callback(key, value);
      },
      immediateNotify,
    );
  }

  getStore() {
    return this.store;
  }

  $value(key: string, value: unknown): DirectiveResult<typeof SourceValue> {
    return this.nt4Directive(key, value);
  }
}

export default NetworkTables;

export const nt4Context = createContext<NetworkTables>('nt4');
