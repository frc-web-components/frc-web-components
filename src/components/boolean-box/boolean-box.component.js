import { html, css, LitElement } from 'lit-element';

/**
 * A box that's shown as one color if true and another color if false.
 *
 * @attr {Boolean} value - If true then the boolean box's color will be the true color. If false the color will be the false color.
 * @attr {String} true-color - The color that is displayed if value is true.
 * @attr {String} false-color - The color that is displayed if value is false.
 * @attr {String} label - A text label that is shown in the center of the boolean box.
 * @csspart box - The box element
 *
 */
class BooleanBox extends LitElement {

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
      value: { type: Boolean, primary: true, reflect: true },
      trueColor: { type: String, attribute: 'true-color', reflect: true },
      falseColor: { type: String, attribute: 'false-color', reflect: true },
      label: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.value = false;
    this.trueColor = 'green';
    this.falseColor = 'red';
    this.label = '';
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

customElements.define('frc-boolean-box', BooleanBox);

webbitRegistry.addExisting('frc-boolean-box', {
  displayName: 'Boolean Box',
  category: 'General',
  description: `A box that's shown as one color if true and another color if false.`,
  documentationLink: 'https://frc-web-components.github.io/components/boolean-box/',
  slots: [],
  editorTabs: ['properties', 'sources'],
  properties: {
    value: { type: Boolean, primary: true, defaultValue: false },
    trueColor: { type: String, attribute: 'true-color', defaultValue: 'green' },
    falseColor: { type: String, attribute: 'false-color', defaultValue: 'red' },
    label: { type: String, defaultValue: '' },
  }
});