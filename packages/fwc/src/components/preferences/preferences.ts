import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

type IPreferences = {
  [property: string]: IPreferences | string | number | boolean;
};

export class Preferences extends LitElement {
  @property({ type: String, attribute: 'source-root' }) sourceRoot: string = '';
  @property({ type: Object }) preferences: IPreferences = {};
  @property({ type: String }) search = '';
  @property({ type: Boolean }) editable = false;

  static styles = css`
    :host {
      display: inline-grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 8px;
      row-gap: 5px;
      align-items: center;
      justify-items: start;
      width: 250px;
      font-family: sans-serif;
      box-sizing: border-box;
    }

    input:not([type='checkbox']) {
      width: 100%;
    }

    input {
      margin: 0;
      box-sizing: border-box;
    }

    label {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
    }
  `;

  #dispatchChange(property: string, value: unknown): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          property,
          value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  #renderInputs(prefs: IPreferences, sourceRoot?: string): TemplateResult {
    return html`
      ${Object.entries(prefs).map(([property, value]) => {
        const source =
          typeof sourceRoot !== 'undefined'
            ? [sourceRoot, property].join('/')
            : property;
        if (typeof value === 'boolean') {
          return html`
            <label>${source}</label>
            <input type="checkbox" />
          `;
        }
        if (typeof value === 'number') {
          return html`
            <label>${source}</label>
            <input type="number" />
          `;
        }
        if (typeof value === 'string') {
          return html`
            <label>${source}</label>
            <input type="text" />
          `;
        }
        return this.#renderInputs(value, source);
      })}
    `;
  }

  render() {
    return html` ${this.#renderInputs(this.preferences)} `;
  }
}

export default Preferences;

if (!customElements.get('frc-preferences')) {
  customElements.define('frc-preferences', Preferences);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-preferences': Preferences;
  }
}
