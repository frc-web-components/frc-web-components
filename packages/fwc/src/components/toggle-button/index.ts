import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export const toggleButtonDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Toggle Button',
  },
  properties: {
    toggled: {
      type: 'Boolean',
      defaultValue: false,
      primary: true,
      changeEvent: 'toggle',
    },
    label: { type: 'String', defaultValue: 'Button' },
  },
};

export class ToggleButton extends LitElement {
  @property({ type: Boolean }) toggled = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) label = 'Button';

  static styles = css`
    :host {
      display: inline-block;
      width: 100px;
      height: 50px;
      font-family: sans-serif;
      font-size: 16px;
      letter-spacing: 0.5px;
    }

    button {
      width: 100%;
      height: 100%;
      margin: 0;
      border: none;
      border-radius: 4px;
      font-size: inherit;
      font-family: inherit;
      letter-spacing: inherit;
      background: var(--frc-button-background-color, rgb(230, 230, 230));
      color: var(--frc-button-text-color, black);
    }

    .toggled {
      background: var(--frc-button-toggled-background-color, black);
      color: var(--frc-button-toggled-text-color, white);
      font-weight: bold;
    }
  `;

  onClick(): void {
    if (this.disabled) {
      return;
    }
    this.toggled = !this.toggled;
    this.dispatchEvent(
      new CustomEvent('toggle', {
        detail: {
          toggled: this.toggled,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render(): TemplateResult {
    return html`
      <button class="${this.toggled ? 'toggled' : ''}" @click="${this.onClick}">
        ${this.label}
      </button>
    `;
  }
}

export default ToggleButton;

if (!customElements.get('frc-toggle-button')) {
  customElements.define('frc-toggle-button', ToggleButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-toggle-button': ToggleButton;
  }
}
