import { html, css, LitElement } from 'lit';

export const elementName = 'frc-boolean-box';

export const elementConfig = {
  dashboard: {
    displayName: 'Boolean Box',
  },
  properties: {
    value: { type: Boolean, primary: true },
    trueColor: {
      type: String,
      input: { type: 'ColorPicker' },
      defaultValue: '#00ff00',
      attribute: 'true-color',
    },
    falseColor: {
      type: String,
      input: { type: 'ColorPicker' },
      defaultValue: '#ff0000',
      attribute: 'false-color',
    },
    label: { type: String },
  },
};

class BooleanBox extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: inline-block;
      width: 80px;
      height: 80px;
      padding: 5px;
      box-sizing: border-box;
    }

    [part='box'] {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      background-color: var(--box-color);
      text-align: center;
    }
  `;

  constructor() {
    super();
    this.value = false;
    this.trueColor = '#00ff00';
    this.falseColor = '#ff0000';
    this.label = '';
  }

  updated() {
    const backgroundNode = this.shadowRoot.querySelector('[part=box]');
    const backgroundColor = this.value ? this.trueColor : this.falseColor;

    backgroundNode.style.setProperty('--box-color', backgroundColor);
  }

  render() {
    return html` <div part="box">${this.label || html`&nbsp;`}</div> `;
  }
}

customElements.define(elementName, BooleanBox);
