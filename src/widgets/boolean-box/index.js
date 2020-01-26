import { Widget, html, css } from '@lit-dashboard/lit-dashboard';
import { registerWidget } from '@lit-dashboard/lit-dashboard/app';

class BooleanBox extends Widget {

  static get styles() {
    return css`
      :host { 
        display: block; 
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
      }
    `;
  }

  static get properties() {
    return {
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
    if (this.sourceValue == true) {
      backgroundColor = this.trueColor;
    }
    else if (this.sourceValue == false) {
      backgroundColor = this.falseColor;
    }
    backgroundNode.style.setProperty('--box-color', backgroundColor);
  }

  render() {
    return html`
      <div part="box">
        <slot></slot>
      </div>
    `;
  }
}

registerWidget('boolean-box', {
  class: BooleanBox,
  label: 'Boolean Box',
  category: 'FRC',
  acceptedTypes: ['Boolean'],
  image: require.resolve('./boolean-box.png')
});