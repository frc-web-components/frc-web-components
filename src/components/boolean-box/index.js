import { Webbit, html, css } from '@webbitjs/webbit';

class BooleanBox extends Webbit {

  static get styles() {
    return css`
      :host { 
        display: inline-block; 
        width: 100px;
        height: 100px;
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
      defaultColor: { type: String, attribute: 'default-color' },
      trueColor: { type: String, attribute: 'true-color' },
      falseColor: { type: String, attribute: 'false-color' }
    };
  }

  constructor() {
    super();
    this.defaultColor = 'black'
    this.trueColor = 'green';
    this.falseColor = 'red';
  }

  updated() {
    const backgroundNode = this.shadowRoot.querySelector('[part=box]');
    let backgroundColor = this.defaultColor;

    if (this.value === true) {
      backgroundColor = this.trueColor;
    }
    else if (this.value === false) {
      backgroundColor = this.falseColor;
    }
    backgroundNode.style.setProperty('--box-color', backgroundColor);
  }

  firstUpdated() {
    const backgroundNode = this.shadowRoot.querySelector('[part=box]');
    backgroundNode.style.setProperty('--box-color', this.defaultColor);
  }

  render() {
    return html`
      <div part="box">
        <slot></slot>
      </div>
    `;
  }
}

webbitRegistry.define('frc-boolean-box', BooleanBox);