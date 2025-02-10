import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement } from 'lit';
import { property, state, query } from 'lit/decorators.js';

export const barDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    topLevel: false,
    displayName: 'Bar',
  },
  properties: {
    value: { type: 'Number' },
    min: { type: 'Number', defaultValue: -1 },
    max: { type: 'Number', defaultValue: 1 },
    center: { type: 'Number' },
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(value, min));
}

export class Bar extends LitElement {
  private _min = -1;
  private _max = 1;

  @property({ type: Number }) value = 0;
  @property({ type: Number }) center = 0;
  @state() dragging = false;

  @property({ type: Number })
  get min(): number {
    return Math.min(this._min, this._max);
  }

  set min(value: number) {
    const oldValue = this._min;
    this._min = value;
    this.requestUpdate('min', oldValue);
  }

  @property({ type: Number })
  get max(): number {
    return Math.max(this._min, this._max);
  }

  set max(value: number) {
    const oldValue = this._max;
    this._max = value;
    this.requestUpdate('max', oldValue);
  }

  @query('[part=foreground]') foreground!: HTMLElement;

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

  updateForeground() {
    const { min, max, center, value, foreground } = this;
    const val = clamp(value, min, max);

    if (max < center) {
      foreground.style.setProperty(
        '--foreground-width',
        `${(Math.abs(val - max) / (max - min)) * 100}%`,
      );
      foreground.style.setProperty('--foreground-left', 'auto');
      foreground.style.setProperty('--foreground-right', '0');
    } else if (min > center) {
      foreground.style.setProperty(
        '--foreground-width',
        `${(Math.abs(val - min) / (max - min)) * 100}%`,
      );
      foreground.style.setProperty('--foreground-left', '0');
      foreground.style.setProperty('--foreground-right', 'auto');
    } else if (val > center) {
      foreground.style.setProperty(
        '--foreground-width',
        `${(Math.abs(val - center) / (max - min)) * 100}%`,
      );
      foreground.style.setProperty(
        '--foreground-left',
        `${(Math.abs(min - center) / (max - min)) * 100}%`,
      );
      foreground.style.setProperty('--foreground-right', 'auto');
    } else {
      foreground.style.setProperty(
        '--foreground-width',
        `${(Math.abs(val - center) / (max - min)) * 100}%`,
      );
      foreground.style.setProperty('--foreground-left', 'auto');
      foreground.style.setProperty(
        '--foreground-right',
        `${(Math.abs(max - center) / (max - min)) * 100}%`,
      );
    }
  }

  resized() {
    this.updateForeground();
  }

  updated() {
    this.updateForeground();
  }

  setDragPosition(ev: MouseEvent) {
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

    window.addEventListener('mousemove', (ev: MouseEvent) => {
      if (!this.dragging) {
        return;
      }

      this.setDragPosition(ev);
    });

    window.addEventListener('mouseup', () => {
      this.dragging = false;
    });
  }

  onMouseDown(ev: DragEvent) {
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

export default Bar;

if (!customElements.get('frc-bar')) {
  customElements.define('frc-bar', Bar);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-bar': Bar;
  }
}
