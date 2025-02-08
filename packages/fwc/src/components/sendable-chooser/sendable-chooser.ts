import { html, css, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import '../icon';
import { WebbitConfig } from '@webbitjs/webbit';

export const sendableChooserOldDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Sendable Chooser',
    topLevel: false,
  },
  properties: {
    options: { type: 'Array' },
    selected: { type: 'String', input: { type: 'StringDropdown' } },
    default: { type: 'String' },
    active: { type: 'String' },
    label: { type: 'String', defaultValue: 'Auto Choices' },
  },
};

export class SendableChooser extends LitElement {
  @property({ type: Array }) options: string[] = [];
  @property({ type: String, reflect: true }) selected = '';
  @property({ type: String }) default = '';
  @property({ type: String }) active = '';
  @property({ type: String, reflect: true }) label = 'Auto Choices';

  @query('select', true) selectElement!: HTMLSelectElement;

  static styles = css`
    :host {
      display: inline-block;
      min-width: 220px;
      font-family: sans-serif;
    }

    .input-container {
      display: flex;
      align-items: flex-end;
      gap: 7px;
      width: 100%;
    }

    frc-icon {
      width: 20px;
      height: 20px;
      margin-bottom: 12px;
    }

    label {
      position: relative;
      display: inline-block;
      width: 100%;
    }

    label:after {
      content: ' ';
      position: absolute;
      right: 15px;
      top: 46%;
      margin-top: -3px;
      z-index: 2;
      pointer-events: none;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 6.9px 4px 0 4px;
      border-color: #aaa transparent transparent transparent;
      pointer-events: none;
    }

    select {
      width: 100%;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      outline: 0 none;

      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      padding: 0 30px 0 10px;

      border: 1px solid #e0e0e0;
      border-radius: 3px;
      line-height: 36px;
      height: 36px;
      background: #fff;
      margin: 0 5px 5px 0;
    }

    p {
      color: var(--frc-sendable-chooser-label-color, black);
      margin: 0;
      font-size: 13px;
      padding-left: 3px;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  `;

  onChange(): void {
    this.selected = this.selectElement.value;
    this.#dispatchChange();
  }

  #dispatchChange(): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { selected: this.selected },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render(): TemplateResult {
    return html`
      <div class="container">
        ${this.label ? html` <p>${this.label}</p> ` : ''}
        <div class="input-container">
          <label>
            <select @change=${this.onChange} .value=${this.selected}>
              ${this.options.map(
                (option) => html`
                  <option value=${option} ?selected=${this.selected === option}>
                    ${option}
                  </option>
                `,
              )}
            </select>
          </label>
          ${this.options.length > 0
            ? html`
                ${this.selected === this.active
                  ? html`<frc-icon icon="check" color="green"></frc-icon>`
                  : html`<frc-icon icon="close" color="red"></frc-icon>`}
              `
            : ''}
        </div>
      </div>
    `;
  }
}

export default SendableChooser;

if (!customElements.get('frc-sendable-chooser')) {
  customElements.define('frc-sendable-chooser', SendableChooser);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-sendable-chooser': SendableChooser;
  }
}
