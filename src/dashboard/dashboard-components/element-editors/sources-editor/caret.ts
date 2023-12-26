import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './source-view';

@customElement('dashboard-sources-caret')
export class Caret extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      width: 15px;
      margin-right: 3px;
    }
  `;

  @property({ type: Boolean }) open = false;

  #onToggle() {
    const event = new CustomEvent('toggle', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <span
        class="caret"
        @click=${() => {
          this.#onToggle();
        }}
      >
        ${!this.open
          ? html`
              <vaadin-icon
                icon="vaadin:angle-right"
                class="closed-cursor"
              ></vaadin-icon>
            `
          : html`
              <vaadin-icon
                icon="vaadin:angle-down"
                class="opened-cursor"
              ></vaadin-icon>
            `}
      </span>
    `;
  }
}
