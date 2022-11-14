import { html, css, LitElement } from 'lit';

export const elementName = 'frc-encoder';

export const elementConfig = {
  dashboard: {
    displayName: 'Encoder',
  },
  properties: {
    distance: { type: Number },
    speed: { type: Number },
  },
};

class Encoder extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
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
      color: var(--frc-encoder-label-color, #000);
    }

    vaadin-number-field {
      width: 100%;
      min-width: 50px;
    }
  `;

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

customElements.define(elementName, Encoder);
