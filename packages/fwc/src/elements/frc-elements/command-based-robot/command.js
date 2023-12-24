import { html, css, LitElement } from 'lit';
import { containerStyles } from '../../styles';

export const elementName = 'frc-robot-command';

export const elementConfig = {
  dashboard: {
    displayName: 'Command',
  },
  properties: {
    name: { type: String, defaultValue: 'Command' },
    running: { type: Boolean, changeEvent: 'toggle' },
    controllable: { type: Boolean },
    isParented: { type: Boolean, attribute: 'is-parented' },
    label: { type: String },
  },
};

class Command extends LitElement {
  static properties = elementConfig.properties;

  static styles = [
    containerStyles,
    css`
      :host {
        height: 50px;
      }

      [part='button'] {
        width: 100%;
        height: 100%;
        margin: 0;
      }
    `,
  ];

  onClick() {
    if (this.controllable) {
      this.running = !this.running;

      this.dispatchEvent(
        new CustomEvent('toggle', {
          detail: {
            running: this.running,
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <vaadin-button
        theme="${this.running == true ? 'primary' : ''} contrast"
        part="button"
        @click="${this.onClick}"
      >
        ${this.label || this.name}
      </vaadin-button>
    `;
  }
}

customElements.define(elementName, Command);
