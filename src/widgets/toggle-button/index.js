import { Widget, html, css } from '@lit-dashboard/lit-dashboard';
import { registerWidget } from '@lit-dashboard/lit-dashboard/app';

class ToggleButton extends Widget {

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 100px;
        height: 50px;
      }

      [part=button] {
        width: 100%;
        height: 100%;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: Boolean },
      theme: { type: String }
    }
  }

  constructor() {
    super();
    this.value = false;
    this.theme = 'contrast';
  }

  updated() {
    if (this.hasSource()) {
      this.value = this.sourceValue;
    }
  }

  onClick() {
    const newValue = this.value == true ? false : true;
    if (this.sourceType === 'Boolean') {
      this.sourceValue = newValue;
    }
    else {
      this.value = newValue;
    }
  };

  render() {
    return html`   
      <vaadin-button 
        theme="${this.theme} ${this.value == true ? 'primary' : ''}"
        part="button"
        @click="${this.onClick}"
      >
        <slot></slot>
      </vaadin-button>
    `;
  }
}


registerWidget('toggle-button', {
  class: ToggleButton,
  label: 'Toggle Button',
  category: 'FRC',
  acceptedTypes: ['Boolean'],
  image: require.resolve('./toggle-button.png')
});