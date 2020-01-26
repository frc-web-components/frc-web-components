import { Widget, html, css } from '@lit-dashboard/lit-dashboard';
import { registerWidget } from '@lit-dashboard/lit-dashboard/app';

class RelayWidget extends Widget {

  static get styles() {
    return css`
      :host {
        display: inline-block;
        font-size: 15px;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      vaadin-button {
        border-radius: 0;
        margin: 0;
        flex: 1;
        font-size: inherit;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: String, attribute: false }
    };
  }

  constructor() {
    super();
    this.buttons = ['Off', 'On', 'Forward', 'Reverse'];
    this.value = 'Off';
  }

  setValue(value) {
    if (this.sourceType === 'Relay') {
      this.sourceValue.value = value;
    }
    else {
      this.value = value;
    }
  }

  updated() {
    if (this.sourceType === 'Relay') {
      this.value = this.sourceValue.value;
    }
  }

  render() {
    return html`   
      ${this.buttons.map(button => html`
        <vaadin-button 
          theme="contrast ${this.value == button ? 'primary' : ''}" 
          @click="${() => this.setValue(button)}"
        >
          ${button}
        </vaadin-button>
      `)}
    `;
  }
}

registerWidget('relay-widget', {
  class: RelayWidget,
  label: 'Relay',
  category: 'FRC',
  acceptedTypes: ['Relay'],
  image: require.resolve('./relay.png')
});