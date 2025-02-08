import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement, TemplateResult, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import Store, { Source, SourceProvider } from '@webbitjs/store';

export const preferencesDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Preferences',
    defaultHtml: `<frc-preferences-wrapper source-key="/Preferences"></frc-preferences-wrapper>`,
  },
  properties: {
    search: {
      type: 'String',
    },
    hideTitle: {
      type: 'Boolean',
      attribute: 'hide-title',
    },
    source: { type: 'Source', primary: true, input: { type: 'None' } },
    sourceKey: {
      type: 'String',
      attribute: 'source-key',
      input: { type: 'None' },
    },
    store: { type: 'Store', property: 'store' },
    sourceProvider: {
      type: 'String',
      attribute: 'source-provider',
      input: { type: 'None' },
    },
    provider: { type: 'SourceProvider', property: 'provider' },
  },
};

export class PreferencesWrapper extends LitElement {
  @property({ type: String }) search = '';
  @property({ type: Boolean, attribute: 'hide-title' }) hideTitle = false;
  @property({ type: String, attribute: 'source-key' }) sourceKey = '';
  @property({ type: String, attribute: 'source-provider' }) sourceProvider = '';
  @property({ type: Object }) source: Source | undefined;
  @property({ type: Object, attribute: false }) provider?: SourceProvider;
  @property({ type: Object, attribute: false }) store?: Store;

  #sourceJson: unknown = {};

  #unsubscriber?: () => unknown;

  static styles = css`
    :host {
      display: inline-block;
      width: 250px;
      height: 250px;
    }

    frc-preferences {
      width: 100%;
      height: 100%;
    }
  `;

  #onChange(ev: CustomEvent) {
    const { property, value } = ev.detail;
    this.provider?.userUpdate([this.sourceKey, property].join('/'), value);
  }

  #onSearch(ev: CustomEvent) {
    const { search } = ev.detail;
    this.search = search;
  }

  #updateSourceListener() {
    this.#unsubscriber?.();
    this.#unsubscriber = this.store?.subscribe(
      this.sourceProvider,
      this.sourceKey,
      () => {
        const source = this.store?.getSource(
          this.sourceProvider,
          this.sourceKey,
        );
        this.#sourceJson = source?.getJson(false) ?? {};
        this.requestUpdate();
      },
      true,
    );
  }

  protected updated(
    changedProps: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    if (
      changedProps.has('sourceProvider') ||
      changedProps.has('sourceKey') ||
      changedProps.has('store')
    ) {
      this.#updateSourceListener();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#unsubscriber?.();
  }

  render(): TemplateResult {
    return html`
      <frc-preferences
        @change=${(ev: CustomEvent) => this.#onChange(ev)}
        @search=${(ev: CustomEvent) => this.#onSearch(ev)}
        source-root=${this.sourceKey}
        search=${this.search}
        ?hide-title=${this.hideTitle}
        .preferences=${this.#sourceJson}
      ></frc-preferences>
    `;
  }
}

export default PreferencesWrapper;

if (!customElements.get('frc-preferences-wrapper')) {
  customElements.define('frc-preferences-wrapper', PreferencesWrapper);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-preferences-wrapper': PreferencesWrapper;
  }
}
