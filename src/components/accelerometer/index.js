import { Webbit, html, css } from '@webbitjs/webbit';

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

class Accelerometer extends Webbit {

  static get properties() {
    return {
      value: { type: Number, primary: true },
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
      precision: { 
        type: Number,
        get() {
          return clamp(this._precision, 0, 100);
        }
      },
      hideText: { type: Boolean, attribute: 'hide-text', reflect: true, },
      numTickMarks: { 
        type: Number, 
        attribute: 'num-tick-marks', 
        reflect: true,
        get() {
          return Math.max(0, this._numTickMarks);
        }
      },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 60px;
        width: 400px;
        font-family: sans-serif;
      }

      .bar {
        position: relative;
        width: calc(100% - 20px);
        height: 20px;
        border-radius: 3px;
        margin: 0 10px;
        background: #DDD;
      }

      .foreground {
        position: absolute;
        top: 0;
        height: 20px;
        background: lightblue;
        border-radius: 3px;
        width: var(--foreground-width);
        left: var(--foreground-left);
        right: var(--foreground-right);
      }

      .text {
        font-size: 15px;
        line-height: 18px;
        position: relative;
        text-align: center;
        margin: 0;
      }

      table-axis {
        width: calc(100% - 25px);
        margin: 2px auto 0;
        display: block;
      }
    `
  }

  constructor() {
    super();
    this.value = 0;
    this.min = -1;
    this.max = 1;
    this.precision = 2;
    this.hideText = false;
    this.numTickMarks = 3;
  }

  updateForeground() {
    const { min, max, center, value } = this;
    const val = clamp(value, min, max);

    const foreground = this.shadowRoot.querySelector('.foreground');

    if (max < 0) {
      foreground.style.setProperty(
        '--foreground-width', 
        Math.abs(val - max) / (max - min) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-left', 'auto');
      foreground.style.setProperty('--foreground-right', '0');
    }
    else if (min > 0) {
      foreground.style.setProperty(
        '--foreground-width', 
        Math.abs(val - min) / (max - min) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-left', '0');
      foreground.style.setProperty('--foreground-right', 'auto');
    }
    else if (val > 0) {
      foreground.style.setProperty(
        '--foreground-width', 
        Math.abs(val) / (max - min) * 100 + '%'
      );
      foreground.style.setProperty(
        '--foreground-left', 
        Math.abs(min) / (max - min) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-right', 'auto');
    }
    else {
      foreground.style.setProperty(
        '--foreground-width', 
        Math.abs(val) / (max - min) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-left', 'auto');
      foreground.style.setProperty(
        '--foreground-right', 
        Math.abs(max) / (max - min) * 100 + '%'
      );
    }
  }

  resized() {
    this.updateForeground();
  }

  updated() {
    this.updateForeground();
  }

  render() {
    return html`
      <div class="accelerometer">
      <div class="bar">
        <div class="foreground"></div>
        ${!this.hideText ? html`
          <p class="text">
            ${this.value.toFixed(this.precision)} g
          </p>
        ` : ''}
      </div>
      <table-axis 
        id="axis"
        ticks="${this.numTickMarks}"
        .range="${[this.min, this.max]}"
      ></table-axis>
    </div>
    `;
  }
}


window.webbitRegistry.define('frc-accelerometer', Accelerometer);