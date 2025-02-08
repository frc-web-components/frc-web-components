// Component based on https://github.com/Mechanical-Advantage/NetworkAlerts
import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import '../icon';
import { WebbitConfig } from '@webbitjs/webbit';

export const networkAlertsDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Network Alerts',
  },
  properties: {
    errors: { type: 'Array' },
    warnings: { type: 'Array' },
    infos: { type: 'Array' },
    level: {
      type: 'String',
      defaultValue: 'info',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return ['error', 'warning', 'info'];
        },
      },
    },
    hideTitle: { type: 'Boolean', attribute: 'hide-title' },
  },
};

type AlertLevel = 'error' | 'warning' | 'info';

const WARNING_ICON =
  'm40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z';

const ERROR_ICON =
  'M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z';

const INFO_ICON =
  'M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z';

export class NetworkAlerts extends LitElement {
  @property({ type: Array }) errors: string[] = [];
  @property({ type: Array }) warnings: string[] = [];
  @property({ type: Array }) infos: string[] = [];
  @property({ type: String }) level: AlertLevel = 'info';
  @property({ type: Boolean, attribute: 'hide-title' }) hideTitle = false;

  static styles = css`
    :host {
      font-family: sans-serif;
      display: inline-block;
      width: 300px;
      height: auto;
      box-sizing: border-box;
      color: var(--frc-network-alerts-text-color, black);
    }

    .alerts-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    header {
      background: var(--frc-network-alerts-header-color, lightblue);
      padding: 10px 0;
      text-align: center;
      font-weight: bold;
    }

    .alerts-list {
      padding: 8px 5px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 9px;
      flex: 1;
      overflow-y: auto;
    }

    .alert {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .icon {
      width: 24px;
      height: 24px;
    }

    .alert label {
      flex: 1;
    }

    .icon frc-icon {
      width: 100%;
      height: 100%;
    }
  `;

  render(): TemplateResult {
    return html`
      <div class="alerts-container">
        ${when(!this.hideTitle, () => html` <header>Alerts</header> `)}
        <div class="alerts-list">
          ${this.errors.map(
            (error) => html`
              <div class="alert">
                <div class="icon">
                  <frc-icon
                    color="red"
                    svg-path=${ERROR_ICON}
                    view-box="0 -960 960 960"
                  ></frc-icon>
                </div>
                <label>${error}</label>
              </div>
            `,
          )}
          ${when(
            this.level !== 'error',
            () => html`
              ${this.warnings.map(
                (warning) => html`
                  <div class="alert">
                    <div class="icon">
                      <frc-icon
                        color="yellow"
                        svg-path=${WARNING_ICON}
                        view-box="0 -960 960 960"
                      ></frc-icon>
                    </div>
                    <label>${warning}</label>
                  </div>
                `,
              )}
            `,
          )}
          ${when(
            this.level === 'info',
            () => html`
              ${this.infos.map(
                (info) => html`
                  <div class="alert">
                    <div class="icon">
                      <frc-icon
                        color="green"
                        svg-path=${INFO_ICON}
                        view-box="0 -960 960 960"
                      ></frc-icon>
                    </div>
                    <label>${info}</label>
                  </div>
                `,
              )}
            `,
          )}
        </div>
      </div>
    `;
  }
}

export default NetworkAlerts;

if (!customElements.get('frc-network-alerts')) {
  customElements.define('frc-network-alerts', NetworkAlerts);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-network-alerts': NetworkAlerts;
  }
}
