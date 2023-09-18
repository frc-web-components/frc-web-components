import Store, { Source } from '@webbitjs/store';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('dashboard-source-view')
export class SourceView extends LitElement {
  @property({ type: Boolean }) onlyChild = false;
  @property({ type: String }) label = '';
  @property({ type: String }) providerName = '';
  @property({ type: Object }) source!: Source;
  @property({ type: Number }) level = 0;
  @property({ type: String }) selectedSourceKey = '';
  @property({ type: String }) selectedSourceProvider = '';
  @property({ type: Object }) selectedSource: Source | null = null;
  @property({ type: Object }) store!: Store;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) open = false;

  get detailsElement() {
    return this.renderRoot.querySelector('details') as HTMLDetailsElement;
  }

  protected createRenderRoot() {
    return this;
  }

  #hasSources() {
    return this.source.hasChildren();
  }

  #hasValue() {
    return this.source.hasValue();
  }

  #isSelected() {
    return this.source === this.selectedSource;
  }

  #isSelectedKeyDescendent() {
    if (!this.selectedSource) {
      return false;
    }
    return this.selectedSource.getKey().startsWith(`${this.source.getKey()}/`);
  }

  protected updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('selectedSource')) {
      if (this.#isSelectedKeyDescendent()) {
        this.detailsElement.open = true;
      }
    }
  }

  protected firstUpdated() {
    this.store.subscribe(
      this.providerName,
      this.source.getKey(),
      () => this.requestUpdate(),
      true
    );
  }

  #onSelect() {
    const event = new CustomEvent('sourceSelect', {
      bubbles: true,
      composed: true,
      detail: {
        sourceKey: this.source.getKey(),
        sourceProvider: this.providerName,
      },
    });
    this.dispatchEvent(event);
  }

  #renderValue() {
    const value = this.source.getValue();

    if (typeof value === 'boolean') {
      return html`
        <input disabled type="checkbox" ?checked="${value}" />
        <label>${value.toString()}</label>
      `;
    }
    if (typeof value === 'string') {
      return html` "${value}" `;
    }
    if (typeof value === 'number') {
      return html` ${value} `;
    }
    if (value instanceof Array) {
      return html` [${value.join(', ')}] `;
    }

    return html``;
  }

  #onToggle() {
    const event = new CustomEvent(this.open ? 'close' : 'open', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  protected render() {
    return html`
      <td
        class=${classMap({
          childless: !this.#hasSources(),
          selected: this.#isSelected(),
          open: this.open,
        })}
        style=${`--level: ${this.level}`}
      >
        ${this.#hasSources()
          ? html`
              <span
                class="caret"
                @click=${() => {
                  this.#onToggle();
                }}
              >
                <vaadin-icon
                  icon="vaadin:angle-right"
                  class="closed-cursor"
                ></vaadin-icon>
                <vaadin-icon
                  icon="vaadin:angle-down"
                  class="opened-cursor"
                ></vaadin-icon>
              </span>
            `
          : ''}
        ${this.label !== '' ? this.label : html`&nbsp;`}
      </td>
      <td>${this.#hasValue() ? this.#renderValue() : ''}</td>
    `;
  }
}
