import { Webbit, html, css } from '@webbitjs/webbit';

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

class NumberBar extends Webbit {

  static get properties() {
    return {
      value: { 
        type: Number, 
        primary: true
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
      center: { type: Number, reflect: true },
      hideText: { type: Boolean, attribute: 'hide-text', reflect: true, },
      numTickMarks: { 
        type: Number, 
        attribute: 'num-tick-marks', 
        reflect: true,
        get() {
          return Math.max(0, this._numTickMarks);
        }
      }
    };
  }

  static get styles() {
    return css`
      
      :host {
        display: block;
        height: 60px;
        width: 400px;
      }

      .number-bar-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
      }

      .bar {
        position: relative;
        width: calc(100% - 60px);
        height: 20px;
        border-radius: 3px;
        margin: 0 30px;
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
        text-align: center;
        font-weight: bold;
        font-size: 15px;
        line-height: 18px;
        position: relative;
        margin-bottom: 0;
      }

      table-axis {
        width: calc(100% - 60px);
        margin: 2px auto 0;
        display: block;
      }
    `;
  }

  constructor() {
    super();
    this.value = 0;
    this.min = -1;
    this.max = 1;
    this.center = 0;
    this.hideText = false;
    this.numTickMarks = 5;
  }

  updateForeground() {
    const { min, max, center, value } = this;
    const val = clamp(value, min, max);

    const foreground = this.shadowRoot.querySelector('.foreground');

    if (max < center) {
      foreground.style.setProperty(
        '--foreground-width', 
        Math.abs(val - max) / (max - min) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-left', 'auto');
      foreground.style.setProperty('--foreground-right', '0');
    }
    else if (min > center) {
      foreground.style.setProperty(
        '--foreground-width', 
        Math.abs(val - min) / (max - min) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-left', '0');
      foreground.style.setProperty('--foreground-right', 'auto');
    }
    else if (val > center) {
      foreground.style.setProperty(
        '--foreground-width', 
        Math.abs(val - center) / (max - min) * 100 + '%'
      );
      foreground.style.setProperty(
        '--foreground-left', 
        Math.abs(min - center) / (max - min) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-right', 'auto');
    }
    else {
      foreground.style.setProperty(
        '--foreground-width', 
        Math.abs(val - center) / (max - min) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-left', 'auto');
      foreground.style.setProperty(
        '--foreground-right', 
        Math.abs(max - center) / (max - min) * 100 + '%'
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
      <div class="number-bar-container">
        <div class="number-bar">
          <div class="bar">
            <div class="foreground"></div>
            ${!this.hideText ? html`
              <p class="text">
                ${this.value}
              </p>
            ` : ''}
          </div>
          <table-axis 
            id="axis"
            ticks="${this.numTickMarks}"
            .range="${[this.min, this.max]}"></table-axis>
        </div>
      </div>
    `;
  }
}

webbitRegistry.define('frc-number-bar', NumberBar);