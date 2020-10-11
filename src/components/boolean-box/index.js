import { Webbit, html, css } from '@webbitjs/webbit';

class BooleanBox extends Webbit {

  static get metadata() {
    return {
      displayName: 'Boolean Box',
      category: 'General',
      description: `A box that's shown as one color if true and another color if false.`,
      documentationLink: 'https://frc-web-components.github.io/components/boolean-box/',
      slots: [],
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
      defaultColor: { type: String },
      trueColor: { type: String },
      falseColor: { type: String },
      label: { type: String },
    };
  }

  constructor() {
    super();
    this.defaultColor = 'black'
    this.trueColor = 'green';
    this.falseColor = 'red';
    this.label = '';
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
    super.firstUpdated();
    const backgroundNode = this.shadowRoot.querySelector('[part=box]');
    backgroundNode.style.setProperty('--box-color', this.defaultColor);
  }

  render() {
    return html`
      <div part="box">
        ${this.label}
      </div>
    `;
  }
}

webbitRegistry.define('frc-boolean-box', BooleanBox);