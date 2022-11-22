/* eslint-disable import/extensions */
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export const toggleButtonConfig = {
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

@customElement('frc-toggle-button')
export class ToggleButton extends LitElement {
  @property({ type: Boolean }) toggled = false;
  @property({ type: String }) label = 'Button';

  static styles = css`
    :host {
      width: 100px;
      height: 50px;
    }
    [part='button'] {
      width: 100%;
      height: 100%;
      margin: 0;
    }
  `;

  onClick(): void {
    this.toggled = !this.toggled;
    this.dispatchEvent(
      new CustomEvent('toggle', {
        detail: {
          toggled: this.toggled,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render(): TemplateResult {
    return html`
      <vaadin-button
        theme="${this.toggled ? 'primary' : ''} contrast"
        part="button"
        @click="${this.onClick}"
      >
        ${this.label}
      </vaadin-button>
    `;
  }
}
