import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../icon';
import { WebbitConfig } from '@webbitjs/webbit';
import Store, { SourceProvider } from '@webbitjs/store';

export const sendableChooserDashboardConfig: Partial<WebbitConfig> = {
  defaultSourceKey: '/SmartDashboard/Auto choices',
  defaultSourceProvider: 'NetworkTables',
  dashboard: {
    displayName: 'Sendable Chooser',
  },
  properties: {
    options: { type: 'Array' },
    selected: { type: 'String', input: { type: 'StringDropdown' } },
    default: { type: 'String' },
    active: { type: 'String' },
    label: { type: 'String', defaultValue: 'Auto Choices' },

    provider: { type: 'SourceProvider', property: 'provider' },
    store: { type: 'Store', property: 'store' },
    sourceProvider: {
      type: 'String',
      attribute: 'source-provider',
      input: { type: 'None' },
    },
    sourceKey: {
      type: 'String',
      attribute: 'source-key',
      input: { type: 'None' },
    },
  },
};

export class SendableChooserWrapper extends LitElement {
  @property({ type: Array }) options: string[] = [];
  @property({ type: String, reflect: true }) selected = '';
  @property({ type: String }) default = '';
  @property({ type: String }) active = '';
  @property({ type: String, reflect: true }) label = 'Auto Choices';

  @property({ type: Object, attribute: false }) provider?: SourceProvider;
  @property({ type: Object, attribute: false }) store?: Store;
  @property({ type: String, attribute: 'source-provider' }) sourceProvider = '';
  @property({ type: String, attribute: 'source-key' }) sourceKey = '';

  static styles = css`
    :host {
      display: inline-block;
      min-width: 220px;
      font-family: sans-serif;
    }

    frc-sendable-chooser {
      width: 100%;
      height: 100%;
    }
  `;

  #updateSelectedSource(): void {
    const {
      provider,
      store,
      sourceProvider,
      sourceKey,
      default: defaultValue,
    } = this;
    if (!provider || !store || !sourceProvider || !sourceKey) {
      return;
    }

    const source = store.getSource(sourceProvider, sourceKey);
    const selectSource = store.getSource(
      sourceProvider,
      `${sourceKey}/selected`,
    );

    if (source?.hasChildren() && !selectSource?.hasValue()) {
      const value = this.options.includes(this.selected)
        ? this.selected
        : defaultValue;
      provider.userUpdate(`${sourceKey}/selected`, value);
    }
  }

  #onChange(ev: CustomEvent): void {
    this.selected = ev.detail.selected;
    this.#updateSelectedSource();
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('default')) {
      if (!this.options.includes(this.selected)) {
        this.#updateSelectedSource();
      }
    }
  }

  render(): TemplateResult {
    return html`
      <frc-sendable-chooser
        @change=${this.#onChange}
        .options=${this.options}
        .selected=${this.selected}
        .default=${this.default}
        .active=${this.active}
        .label=${this.label}
      ></frc-sendable-chooser>
    `;
  }
}

export default SendableChooserWrapper;

if (!customElements.get('frc-sendable-chooser-wrapper')) {
  customElements.define('frc-sendable-chooser-wrapper', SendableChooserWrapper);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-sendable-chooser-wrapper': SendableChooserWrapper;
  }
}
