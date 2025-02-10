import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../toggle-button';
import { WebbitConfig } from '@webbitjs/webbit';

export const robotCommandDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Command',
  },
  properties: {
    name: { type: 'String', defaultValue: 'Command' },
    running: { type: 'Boolean', changeEvent: 'toggle' },
    controllable: { type: 'Boolean' },
    label: { type: 'String' },
  },
};

export class RobotCommand extends LitElement {
  @property({ type: String }) name = 'Command';
  @property({ type: Boolean }) running = false;
  @property({ type: Boolean }) controllable = false;
  @property({ type: String }) label = '';

  static styles = css`
    :host {
      display: inline-block;
      width: 100px;
      height: 50px;
      font-family: sans-serif;
      font-size: 16px;
      letter-spacing: 0.5px;
    }

    frc-toggle-button {
      width: 100%;
      height: 100%;
    }
  `;

  #onClick(ev: CustomEvent): void {
    ev.stopPropagation();
    this.running = !this.running;

    this.dispatchEvent(
      new CustomEvent('toggle', {
        detail: {
          running: this.running,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render(): TemplateResult {
    return html`
      <frc-toggle-button
        ?disabled="${!this.controllable}"
        ?toggled="${this.running}"
        label=${this.label || this.name}
        @toggle="${this.#onClick}"
      >
      </frc-toggle-button>
    `;
  }
}

if (!customElements.get('frc-robot-command')) {
  customElements.define('frc-robot-command', RobotCommand);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-robot-command': RobotCommand;
  }
}
