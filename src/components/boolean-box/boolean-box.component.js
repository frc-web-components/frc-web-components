import { html, css } from 'lit-element';
import { Webbit, define } from '../../webbit';

class BooleanBox extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Boolean Box',
      category: 'General',
      description: `A box that's shown as one color if true and another color if false.`,
      documentationLink: 'https://frc-web-components.github.io/components/boolean-box/',
      slots: [],
      editorTabs: ['properties', 'sources'],
    };
  }

  static get styles() {
    return css`
      :host { 
        display: inline-block; 
        width: 100px;
        height: 100px;
        margin: 5px;
      }

      [part=box] {
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
  }

  static get properties() {
    return {
      value: { type: Boolean, primary: true },
      trueColor: { type: String, defaultValue: 'green' },
      falseColor: { type: String, defaultValue: 'red' },
      label: { type: String },
    };
  }

  updated() {
    const backgroundNode = this.shadowRoot.querySelector('[part=box]');

    const backgroundColor = this.value 
      ? (this.trueColor || 'green')
      : (this.falseColor || 'red');

    backgroundNode.style.setProperty('--box-color', backgroundColor);
  }

  render() {
    return html`
      <div part="box">
        ${this.label || ''}
      </div>
    `;
  }
}

define('frc-boolean-box', BooleanBox);