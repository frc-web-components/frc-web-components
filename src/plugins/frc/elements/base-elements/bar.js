import { LitElement, html, css } from 'lit';

export const elementName = 'frc-bar';

export const elementConfig = {
  dashboard: {
    topLevel: false,
    displayName: 'Bar',
  },
  properties: {
    value: { type: Number },
    min: { type: Number, defaultValue: -1 },
    max: { type: Number, defaultValue: 1 },
    center: { type: Number },
  },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

class Bar extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      width: 300px;
      height: 20px;
      background: var(--frc-bar-background, #ddd);
      color: var(--frc-bar-color, black);
      font-size: 15px;
      line-height: 18px;
      text-align: center;
    }

    [part='dragger'] {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
    }

    [part='foreground'] {
      position: absolute;
      top: 0;
      height: 100%;
      background: var(--frc-bar-foreground, lightblue);
      border-radius: 3px;
      width: var(--foreground-width);
      left: var(--foreground-left);
      right: var(--foreground-right);
      pointer-events: none;
    }

    .content {
      position: relative;
    }
  `;

  constructor() {
    super();
    this.value = 0;
    this.min = -1;
    this.max = 1;
    this.center = 0;
    this.dragging = false;
  }

  get min() {
    return Math.min(this._min, this._max);
  }

  set min(value) {
    const oldValue = this._min;
    this._min = value;
    this.requestUpdate('min', oldValue);
  }

  get max() {
    return Math.max(this._min, this._max);
  }

  set max(value) {
    const oldValue = this._max;
    this._max = value;
    this.requestUpdate('max', oldValue);
  }

  updateForeground() {
    const { min, max, center, value } = this;
    const val = clamp(value, min, max);

    const foreground = this.shadowRoot.querySelector('[part=foreground]');

    if (max < center) {
      foreground.style.setProperty(
        '--foreground-width',
        (Math.abs(val - max) / (max - min)) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-left', 'auto');
      foreground.style.setProperty('--foreground-right', '0');
    } else if (min > center) {
      foreground.style.setProperty(
        '--foreground-width',
        (Math.abs(val - min) / (max - min)) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-left', '0');
      foreground.style.setProperty('--foreground-right', 'auto');
    } else if (val > center) {
      foreground.style.setProperty(
        '--foreground-width',
        (Math.abs(val - center) / (max - min)) * 100 + '%'
      );
      foreground.style.setProperty(
        '--foreground-left',
        (Math.abs(min - center) / (max - min)) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-right', 'auto');
    } else {
      foreground.style.setProperty(
        '--foreground-width',
        (Math.abs(val - center) / (max - min)) * 100 + '%'
      );
      foreground.style.setProperty('--foreground-left', 'auto');
      foreground.style.setProperty(
        '--foreground-right',
        (Math.abs(max - center) / (max - min)) * 100 + '%'
      );
    }
  }

  resized() {
    this.updateForeground();
  }

  updated() {
    this.updateForeground();
  }

  setDragPosition(ev) {
    const { left, width } = this.getBoundingClientRect();
    const x = ev.clientX - left;
    const dragPosition = clamp(x / width, 0, 1);
    const value = this.min + (this.max - this.min) * dragPosition;

    const event = new CustomEvent('barDrag', {
      bubbles: true,
      composed: true,
      detail: { value },
    });

    this.dispatchEvent(event);
  }

  firstUpdated() {
    this.setAttribute('draggable', 'false');

    window.addEventListener('mousemove', (ev) => {
      if (!this.dragging) {
        return;
      }

      this.setDragPosition(ev);
    });

    window.addEventListener('mouseup', (ev) => {
      this.dragging = false;
    });
  }

  onMouseDown(ev) {
    this.dragging = true;
    this.setDragPosition(ev);
  }

  render() {
    return html`
      <div part="foreground" draggble="false"></div>
      <div class="content" draggable="false">
        <slot></slot>
      </div>
      <div part="dragger" @mousedown="${this.onMouseDown}"></div>
    `;
  }
}

customElements.define(elementName, Bar);
