import { containerStyles } from '../../styles';
import { html, css, LitElement } from 'lit';

export const elementName = 'frc-label';

export const elementConfig = {
  dashboard: {
    displayName: 'Label',
  },
  properties: {
    text: { type: String, primary: true },
  },
  demos: [{ html: '<frc-label text="label"></frc-label>' }],
};

class Label extends LitElement {
  static properties = elementConfig.properties;

  static styles = [
    containerStyles,
    css`
      :host {
        display: inline;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        text-align: inherit;
        margin: 0;
        padding: 0;
        color: var(--frc-label-text-color, black);
      }
    `,
  ];

  constructor() {
    super();
    this.text = '';
  }

  render() {
    return html`${this.text}`;
  }
}

customElements.define(elementName, Label);
