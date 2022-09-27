/* eslint-disable import/extensions */
import Store, { SourceProvider } from '@webbitjs/store';
import { WebbitConfig } from '@webbitjs/webbit';
import { LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export const fwcNumberConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Number Source',
    layout: {
      movable: false,
      resizable: {
        horizontal: false,
        vertical: false,
      },
    },
  },
  properties: {
    provider: { type: 'SourceProvider', property: 'provider' },
    store: { type: 'Store', property: 'store' },
    sourceProvider: { type: 'String', attribute: 'source-provider', input: { type: 'None' } },
    sourceKey: { type: 'String', attribute: 'source-key', input: { type: 'None' } },
    value: { type: 'Number' },
    defaultOnly: { type: 'Boolean', attribute: 'default-only' },
  },
};

@customElement('fwc-number')
export class FwcNumber extends LitElement {
  static styles = css`
    :host {
      display: none;
    }
  `;

  @property({ type: Object, attribute: false }) provider?: SourceProvider;
  @property({ type: Object, attribute: false }) store?: Store;
  @property({ type: String, attribute: 'source-provider' }) sourceProvider = '';
  @property({ type: String, attribute: 'source-key' }) sourceKey = '';
  @property({ type: Number }) value = 0;
  @property({ type: Boolean, attribute: 'default-only' }) defaultOnly = false;

  updated(): void {
    const {
      provider, store, sourceProvider, sourceKey, value, defaultOnly,
    } = this;
    if (!provider || !store || !sourceProvider || !sourceKey) {
      return;
    }
    if (!defaultOnly) {
      provider.userUpdate(sourceKey, value);
    } else {
      const source = store.getSource(sourceProvider, sourceKey);
      if (!source?.hasValue()) {
        provider.userUpdate(sourceKey, value);
      }
    }
  }
}