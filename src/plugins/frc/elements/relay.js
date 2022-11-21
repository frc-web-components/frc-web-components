import { html, css, LitElement } from 'lit';

export const elementName = 'frc-relay';

export const elementConfig = {
  dashboard: {
    displayName: 'Relay',
  },
  properties: {
    value: {
      type: String,
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

class Relay extends LitElement {
  static styles = css`
    :host {
      font-size: 15px;
      display: inline-flex;
      flex-direction: column;
      width: 150px;
      height: 300px;
    }

    [part='button'] {
      border-radius: 0;
      margin: 0;
      flex: 1;
      font-size: inherit;
      height: 100%;
    }
  `;

  static properties = elementConfig.properties;

  constructor() {
    super();
    this.buttons = ['Off', 'On', 'Forward', 'Reverse'];
    this.value = 'Off';
  }

  setValue(value) {
    this.value = value;
  }

  render() {
    return html`
      ${this.buttons.map(
        (button) => html`
          <vaadin-button
            part="button"
            theme="contrast ${this.value == button ? 'primary' : ''}"
            @click="${() => this.setValue(button)}"
          >
            ${button}
          </vaadin-button>
        `
      )}
    `;
  }
}

customElements.define(elementName, Relay);
