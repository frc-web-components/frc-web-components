import { html, css, LitElement } from 'lit';

export const elementName = 'frc-number-slider';

export const elementConfig = {
  dashboard: {
    displayName: 'Number Slider',
  },
  properties: {
    value: { type: Number, primary: true, changeEvent: 'change' },
    min: { type: Number, defaultValue: -1 },
    max: { type: Number, defaultValue: 1 },
    blockIncrement: {
      type: Number,
      attribute: 'block-increment',
      defaultValue: 0.05,
    },
  },
};

class NumberSlider extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: inline-block;
      height: 50px;
      width: 300px;
    }

    .slider-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 15px;
    }

    input {
      width: 100%;
    }

    table-axis {
      width: calc(85% - 14px);
      max-width: calc(100% - 74px);
      display: block;
    }
  `;

  constructor() {
    super();
    this.value = 0;
    this.min = -1;
    this.max = 1;
    this.blockIncrement = 0.05;
  }

  onChange(ev) {
    this.value = parseFloat(ev.target.value);
    this.#dispatchChange();
  }

  #dispatchChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  firstUpdated() {
    // The value is not initially being set for fractions for some reason
    setTimeout(() => {
      this.renderRoot.querySelector('#slider').value = this.value;
    });
  }

  render() {
    const min = Math.min(this.min, this.max);
    const max = Math.max(this.min, this.max);
    const value = Math.max(min, Math.min(this.value, max));

    return html`
      <div class="slider-container">
        <input
          id="slider"
          type="range"
          .value="${value.toString()}"
          min="${min}"
          max="${max}"
          step="${this.blockIncrement}"
          @change="${this.onChange}"
        />

        <frc-table-axis
          ticks="5"
          .range="${[this.min, this.max]}"
        ></frc-table-axis>
      </div>
    `;
  }
}

customElements.define(elementName, NumberSlider);
