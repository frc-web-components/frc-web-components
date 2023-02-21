/* eslint-disable import/extensions */
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Store, { SourceProvider } from '@webbitjs/store';

export default {
  defaultSourceKey: '/SmartDashboard/Auto choices',
  defaultSourceProvider: 'NetworkTables',
  dashboard: {
    displayName: 'Sendable Chooser',
  },
  properties: {
    options: { type: 'Array' },
    selected: {
      type: 'String',
      changeEvent: 'change',
      primary: true,
    },
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

@customElement('frc-sendable-chooser')
export class SendableChooser extends LitElement {
  @property({ type: Array }) options: string[] = [];
  @property({ type: String }) selected = '';
  @property({ type: String }) default = '';
  @property({ type: String }) active = '';
  @property({ type: String }) label = 'Auto Choices';

  @property({ type: Object, attribute: false }) provider?: SourceProvider;
  @property({ type: Object, attribute: false }) store?: Store;
  @property({ type: String, attribute: 'source-provider' }) sourceProvider = '';
  @property({ type: String, attribute: 'source-key' }) sourceKey = '';

  static styles = css`
    :host {
      display: inline-block;
      min-width: 220px;
    }

    .container {
      display: flex;
      align-items: flex-end;
      gap: 7px;
      width: 100%;
    }

    vaadin-combo-box {
      flex: 1;
    }

    vaadin-icon {
      width: 20px;
      height: 20px;
      margin-bottom: 12px;
    }

    vaadin-icon[icon='vaadin:check'] {
      color: green;
    }

    vaadin-icon[icon='vaadin:exclamation'] {
      color: red;
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
      `${sourceKey}/selected`
    );

    if (source?.hasChildren() && !selectSource?.hasValue()) {
      const value = this.options.includes(this.selected)
        ? this.selected
        : defaultValue;
      provider.userUpdate(`${sourceKey}/selected`, value);
    }
  }

  onChange(ev: Event): void {
    this.selected = (ev as any).detail.value;
    this.#updateSelectedSource();
    this.#dispatchChange();
  }

  #dispatchChange(): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { selected: this.selected },
        bubbles: true,
        composed: true,
      })
    );
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
      <div class="container">
        <vaadin-combo-box
          .items=${this.options}
          value=${this.selected}
          label=${this.label}
          @value-changed=${this.onChange}
        ></vaadin-combo-box>
        ${this.options.length > 0
          ? html`
              ${this.selected === this.active
                ? html`<vaadin-icon icon="vaadin:check"></vaadin-icon>`
                : html`<vaadin-icon icon="vaadin:exclamation"></vaadin-icon>`}
            `
          : ''}
      </div>
    `;
  }
}
