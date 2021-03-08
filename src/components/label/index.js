import { LitElement, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../styles';

class Label extends LitElement {
 
  static get styles() {
    return [
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
        }
      `
    ]
  }

  static get properties() {
    return {
      text: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.text = 'label';
  }

  render() {
    return html`${this.text}`;
  }
}

customElements.define('frc-label', Label);

webbitRegistry.addExisting('frc-label', {
  displayName: 'Label',
  category: 'General',
  description: 'A label',
  documentationLink: 'https://frc-web-components.github.io/components/label/',
  slots: [],
  editorTabs: ['properties', 'sources'],
  resizable: { left: true, right: true, top: false, bottom: false },
  properties: {
    text: { type: String, primary: true },
  }
})