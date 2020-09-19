import { Webbit, html, css } from '@webbitjs/webbit';

class Encoder extends Webbit {

  static get metadata() {
    return {
      displayName: 'Encoder',
      category: 'Robot & Field Info',
      description: 'Component for displaying information about an encoder',
      documentationLink: 'https://frc-web-components.github.io/components/encoder/',
      slots: []
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-grid;
        grid-template-columns: min-content auto;
        grid-template-rows: 50% 50%;
        column-gap: 15px;
        align-items: center;
        width: 250px;
        font-family: sans-serif;
        
      }

      label {
        font-weight: bold;
        text-align: right;
      }

      vaadin-number-field {
        width: 100%;
        min-width: 50px;
      }
    `;
  }

  static get properties() {
    return {
      distance: { type: Number },
      speed: { type: Number }
    };
  }

  constructor() {
    super();
    this.distance = 0;
    this.speed = 0;
  }

  render() {
    return html`   
        <label part="distance-label">Distance</label>
        <vaadin-number-field 
          part="distance-input" 
          value="${this.distance}" 
          readonly
        ></vaadin-number-field>
        <label part="speed-label">Speed</label>
        <vaadin-number-field 
          part="speed-input" 
          value="${this.speed}" 
          readonly
        ></vaadin-number-field>
    `;
  }
}

webbitRegistry.define('frc-encoder', Encoder);