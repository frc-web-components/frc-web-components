import { Webbit, html, css } from '@webbitjs/webbit';

class NumberSlider extends Webbit {

  static get properties() {
    return {
      value: { 
        type: Number, 
        primary: true,
        get() {
          // clamp value
          return Math.max(this.min, Math.min(this._value, this.max));
        }
      },
      min: { 
        type: Number,
        get() {
          return Math.min(this._min, this._max);
        }
      },
      max: { 
        type: Number,
        get() {
          return Math.max(this._min, this._max);
        }
      },
      blockIncrement: { type: Number, attribute: 'block-increment' }
    };
  }

  static get styles() {
    return css`

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
      }

      input {
          width: 85%;
          max-width: calc(100% - 60px);
      }

      table-axis {
          width: calc(85% - 14px);
          max-width: calc(100% - 74px);
          display: block;
      }
    `;
  }

  constructor() {
    super();
    this.value = 0;
    this.min = -1;
    this.max = 1;
    this.blockIncrement = .05;
  }

  onChange(ev) {
    this.value = parseFloat(ev.target.value);
  }

  render() {
    return html`
      <div class="slider-container">
        <input 
          id="slider"
          type="range" 
          min="${this.min}"
          max="${this.max}"
          .value="${this.value.toString()}"
          step="${this.blockIncrement}"
          @change="${this.onChange}"
        />

        <table-axis 
          ticks="5" 
          .range="${[this.min, this.max]}"
        ></table-axis>
      </div>
    `;
  }
}

webbitRegistry.define('frc-number-slider', NumberSlider);