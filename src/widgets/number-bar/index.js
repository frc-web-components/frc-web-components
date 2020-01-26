import { Widget, html, css } from '@lit-dashboard/lit-dashboard';
import { registerWidget } from '@lit-dashboard/lit-dashboard/app';

class NumberBar extends Widget {

  static get properties() {
    return {
      value: { type: Number, attribute: false },
      min: { type: Number },
      max: { type: Number },
      center: { type: Number },
      showText: { type: Boolean, attribute: 'show-text' },
      numTickMarks: { type: Number, attribute: 'num-tick-marks' }
    };
  }

  static get styles() {
    return css`
      
      :host {
        display: block;
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
    this.showText = true;
    this.numTickMarks = 5;
  }

  set numTickMarks(value) {
    const oldValue = this._numTickMarks;
    this._numTickMarks = value;
    this.requestUpdate('numTickMarks', oldValue);
  }

  get numTickMarks() {
    return Math.max(0, this._numTickMarks);
  }

  set min(value) {
    const oldValue = this._min;
    this._min = value;
    this.requestUpdate('min', oldValue);
  }

  get min() {
    return Math.min(this._min, this._max);
  }

  set max(value) {
    const oldValue = this._max;
    this._max = value;
    this.requestUpdate('max', oldValue);
  }

  get max() {
    return Math.max(this._min, this._max);
  }

  updateForeground() {
    const { min, max, center, value } = this;
    const val = Math.clamp(value, min, max);

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
    const defaultValue = Math.clamp(this.center, this.min, this.max);
    this.value = this.sourceType === 'Number' ? this.sourceValue : defaultValue;
    this.updateForeground();
  }

  render() {
    return html`
      <div class="number-bar-container">
        <div class="number-bar">
          <div class="bar">
            <div class="foreground"></div>
            ${this.showText ? html`
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

registerWidget('number-bar', {
  class: NumberBar,
  label: 'Number Bar',
  category: 'FRC',
  acceptedTypes: ['Number'],
  image: require.resolve('./number-bar.png')
});