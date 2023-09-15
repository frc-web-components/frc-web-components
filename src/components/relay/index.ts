import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import '../toggle-group';

const RELAY_OPTIONS = ['Off', 'On', 'Forward', 'Reverse'] as const;
type RelayOption = typeof RELAY_OPTIONS[number];

export default class Relay extends LitElement {
  @property({ type: String }) value: RelayOption = 'Off';
  @property({ type: String }) direction = 'vertical';

  static styles = css`
    :host {
      display: inline-block;
      width: 150px;
      height: 300px;
    }

    frc-toggle-group {
      width: 100%;
      height: 100%;
    }
  `;

  #onChange(ev: CustomEvent): void {
    this.value = ev.detail.value;
  }

  render() {
    return html`
      <frc-toggle-group
        @change=${this.#onChange}
        .options=${RELAY_OPTIONS}
        value=${this.value}
        direction=${this.direction}
      ></frc-toggle-group>
    `;
  }
}

if (!customElements.get('frc-relay')) {
  customElements.define('frc-relay', Relay);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-relay': Relay;
  }
}
