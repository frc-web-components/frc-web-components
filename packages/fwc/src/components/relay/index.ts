import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import '../toggle-group';
import { WebbitConfig } from '@webbitjs/webbit';

export const relayDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Relay',
  },
  properties: {
    value: {
      type: 'String',
      defaultValue: 'Off',
      reflect: true,
      primary: true,
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return ['Off', 'On', 'Forward', 'Reverse'];
        },
      },
    },
  },
};

const RELAY_OPTIONS = ['Off', 'On', 'Forward', 'Reverse'] as const;
type RelayOption = (typeof RELAY_OPTIONS)[number];

export class Relay extends LitElement {
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

export default Relay;

if (!customElements.get('frc-relay')) {
  customElements.define('frc-relay', Relay);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-relay': Relay;
  }
}
