import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../styles';

class Label extends Webbit {

  static get metadata() {
    return {
      displayName: 'Label',
      category: 'General',
      description: 'A label',
      documentationLink: 'https://frc-web-components.github.io/components/label/',
      slots: [],
      resizable: { left: true, right: true, top: false, bottom: false }
    };
  }

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
      ...super.properties,
      text: { type: String, primary: true },
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

webbitRegistry.define('frc-label', Label);