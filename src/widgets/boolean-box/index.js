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
      value: { type: Boolean, reflect: true, primary: true },
      defaultColor: { type: String, attribute: 'default-color', reflect: true },
      trueColor: { type: String, attribute: 'true-color', reflect: true },
      falseColor: { type: String, attribute: 'false-color', reflect: true }
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

registerWidget('boolean-box', {
  class: BooleanBox,
  label: 'Boolean Box',
  category: 'FRC',
  image: require.resolve('./boolean-box.png')
});