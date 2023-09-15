import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import '../accelerometer';
import '../bar';
import '../axis';

export default class ThreeAxisAccelerometer extends LitElement {
  @property({ type: Number }) x = 0;
  @property({ type: Number }) y = 0;
  @property({ type: Number }) z = 0;
  @property({ type: Number }) min = -1;
  @property({ type: Number }) max = 1;
  @property({ type: Number }) center = 0;
  @property({ type: Number }) precision = 2;
  @property({ type: Boolean, attribute: 'hide-text' }) hideText = false;
  @property({ type: Number, attribute: 'num-tick-marks' }) numTickMarks = 3;
  @property({ type: String }) unit = 'g';

  static styles = css`
    :host {
      display: inline-flex;
      flex-direction: column;
      height: auto;
      font-family: sans-serif;
      width: 300px;
    }

    [part='accelerometer'] {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
    }

    [part='accelerometer']:last-child {
      margin-bottom: 0;
    }

    [part='accelerometer'] label {
      width: 10px;
      padding-top: 2px;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--frc-3-axis-accelerometer-label-color, #000);
    }

    frc-accelerometer {
      width: 100%;
      flex: 1;
    }

    :host(:not([num-tick-marks='0'])) frc-accelerometer::part(bar) {
      width: calc(100% - 40px);
      margin: 0 20px;
    }

    :host([num-tick-marks='0']) frc-accelerometer::part(bar) {
      width: 100%;
      margin: 0;
    }
  `;

  private renderAccelerometer(part: 'x' | 'y' | 'z', numTickMarks: number) {
    return html`
      <div part="accelerometer">
        <label part="label">${part}</label>
        <frc-accelerometer
          part="${part}"
          value="${this[part] || 0}"
          min="${this.min}"
          max="${this.max}"
          center="${this.center}"
          precision="${this.precision}"
          ?hide-text="${this.hideText}"
          num-tick-marks="${numTickMarks}"
          unit="${this.unit}"
        ></frc-accelerometer>
      </div>
    `;
  }

  render() {
    return html`
      ${this.renderAccelerometer('x', 0)} ${this.renderAccelerometer('y', 0)}
      ${this.renderAccelerometer('z', this.numTickMarks)}
    `;
  }
}

if (!customElements.get('frc-3-axis-accelerometer')) {
  customElements.define('frc-3-axis-accelerometer', ThreeAxisAccelerometer);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-3-axis-accelerometer': ThreeAxisAccelerometer;
  }
}
