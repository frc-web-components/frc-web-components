import { containerStyles } from '../styles';
import { html, css } from 'lit-element';
import { Webbit, define } from '../../webbit';

class Label extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Label',
      category: 'General',
      description: 'A label',
      documentationLink: 'https://frc-web-components.github.io/components/label/',
      slots: [],
      editorTabs: ['properties', 'sources'],
      resizable: { left: true, right: true, top: false, bottom: false },
      dashboardHtml: `
        <frc-label text="label"></frc-label>
      `
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
    ];
  }

  static get properties() {
    return {
      text: { type: String, primary: true },
    };
  }

  render() {
    return html`${this.text}`;
  }
}

define('frc-label', Label);