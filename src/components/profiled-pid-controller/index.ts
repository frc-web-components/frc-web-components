import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export default class ProfiledPidController extends LitElement {
  @property({ type: Number }) p = 0;
  @property({ type: Number }) i = 0;
  @property({ type: Number }) d = 0;
  @property({ type: Number }) goal = 0;

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

  onPChange(ev: InputEvent): void {
    this.p = parseFloat((ev as any).target.value);
  }

  onIChange(ev: InputEvent): void {
    this.i = parseFloat((ev as any).target.value);
  }

  onDChange(ev: InputEvent): void {
    this.d = parseFloat((ev as any).target.value);
  }

  onGoalChange(ev: InputEvent): void {
    this.goal = parseFloat((ev as any).target.value);
  }

  render(): TemplateResult {
    return html`
      <label>P</label>
      <input type="number" value=${this.p} @change=${this.onPChange} />
      <label>I</label>
      <input type="number" value=${this.i} @change=${this.onIChange} />
      <label>D</label>
      <input type="number" value=${this.d} @change=${this.onDChange} />
      <label>Goal</label>
      <input type="number" value=${this.goal} @change=${this.onGoalChange} />
    `;
  }
}

if (!customElements.get('frc-profiled-pid-controller')) {
  customElements.define('frc-profiled-pid-controller', ProfiledPidController);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-profiled-pid-controller': ProfiledPidController;
  }
}
