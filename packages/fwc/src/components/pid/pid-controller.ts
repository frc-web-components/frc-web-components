import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export const pidControllerDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'PID Controller',
  },
  properties: {
    p: { type: 'Number' },
    i: { type: 'Number' },
    d: { type: 'Number' },
    setpoint: { type: 'Number' },
  },
};

export class PidController extends LitElement {
  @property({ type: Number }) p = 0;
  @property({ type: Number }) i = 0;
  @property({ type: Number }) d = 0;
  @property({ type: Number }) setpoint = 0;

  static styles = css`
    :host {
      display: inline-grid;
      grid-template-columns: min-content auto;
      grid-template-rows: auto auto auto auto;
      column-gap: 10px;
      row-gap: 8px;
      align-items: center;
      height: auto;
      width: 150px;
      font-family: sans-serif;
      color: var(--frc-pid-controller-text-color, black);
    }

    label {
      font-weight: bold;
      text-align: right;
    }

    input {
      width: 100%;
      min-width: 50px;
      display: inline-block;
      box-sizing: border-box;
      padding-left: 5px;
      border-radius: 3px;
      line-height: 36px;
      height: 36px;
      border: 1px solid var(--frc-pid-controller-input-border-color, #e0e0e0);
      color: var(--frc-pid-controller-text-color, black);
      background: var(--frc-pid-controller-input-background-color, white);
    }
  `;

  #emitChange(): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          p: this.p,
          i: this.i,
          d: this.d,
          setpoint: this.setpoint,
        },
      }),
    );
  }

  onPChange(ev: InputEvent): void {
    this.p = parseFloat((ev as any).target.value);
    this.#emitChange();
  }

  onIChange(ev: InputEvent): void {
    this.i = parseFloat((ev as any).target.value);
    this.#emitChange();
  }

  onDChange(ev: InputEvent): void {
    this.d = parseFloat((ev as any).target.value);
    this.#emitChange();
  }

  onSetpointChange(ev: InputEvent): void {
    this.setpoint = parseFloat((ev as any).target.value);
    this.#emitChange();
  }

  render(): TemplateResult {
    return html`
      <label>P</label>
      <input type="number" .value=${this.p} @change=${this.onPChange} />
      <label>I</label>
      <input type="number" .value=${this.i} @change=${this.onIChange} />
      <label>D</label>
      <input type="number" .value=${this.d} @change=${this.onDChange} />
      <label>Setpoint</label>
      <input
        type="number"
        .value=${this.setpoint}
        @change=${this.onSetpointChange}
      />
    `;
  }
}

export default PidController;

if (!customElements.get('frc-pid-controller')) {
  customElements.define('frc-pid-controller', PidController);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-pid-controller': PidController;
  }
}
