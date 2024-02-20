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
      border: none;
      outline: none;
      padding: 2px 4px;
      box-sizing: border-box;
      border-radius: 2px;
    }

    input[type='checkbox'] {
      width: 20px;
      height: 20px;
      appearance: none;
      -webkit-appearance: none;
      display: flex;
      align-content: center;
      justify-content: center;
      font-size: 2rem;
      padding: 0.1rem;
      border-radius: 3px;
    }

    input[type='checkbox']::before {
      content: ' ';
      /* https://yoksel.github.io/url-encoder/ */
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24' style='&%2310; fill: white;&%2310;'%3E%3Cpath d='M382-218 130-470l75-75 177 177 375-375 75 75-450 450Z'/%3E%3C/svg%3E");
      width: 100%;
      background-size: 100% 100%;
      width: 100%;
      height: 100%;
      transform-origin: bottom left;
      transform: scale(0);
    }

    input[type='checkbox']:checked::before {
      transform: scale(1);
    }

    input[type='checkbox']:checked {
      background: #0c6ce9;
    }

    input {
      margin: 0;
      box-sizing: border-box;
      color: var(--frc-preferences-input-text-color, black);
      background: var(
        --frc-preferences-input-background-color,
        rgba(0, 0, 0, 0.1)
      );
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type='number'] {
      -moz-appearance: textfield;
    }

    .number-input {
      display: flex;
      background: var(
        --frc-preferences-input-background-color,
        rgba(0, 0, 0, 0.1)
      );
      box-sizing: border-box;
      height: 20px;
      border-radius: 2px;

      button {
        padding: 0;
        height: 100%;
        width: 20px;
        border: none;
        cursor: pointer;
        background: none;
        line-height: 20px;
        font-size: 15px;
        color: var(--frc-preferences-input-button-text-color, #444);
      }

      input {
        flex: 1;
        background: none;
      }
    }

    label {
      color: var(--frc-preferences-label-color, black);
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

  #updateValue(
    sourceKey: string,
    value: boolean | number | string,
    prefs: IPreferences,
    property: string
  ) {
    prefs[property] = value;
    this.#dispatchChange(sourceKey, value);
    this.requestUpdate();
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
            <input
              type="checkbox"
              .checked=${value}
              @change=${(ev: any) => {
                this.#updateValue(source, ev.target.checked, prefs, property);
              }}
            />
          `;
        }
        if (typeof value === 'number') {
          return html`
            <label>${source}</label>
            <div class="number-input">
              <button
                @click=${() => {
                  this.#updateValue(source, value - 1, prefs, property);
                }}
              >
                -
              </button>
              <input
                type="number"
                .value=${value}
                @change=${(ev: any) => {
                  this.#updateValue(
                    source,
                    parseFloat(ev.target.value),
                    prefs,
                    property
                  );
                }}
              />
              <button
                @click=${() => {
                  this.#updateValue(source, value + 1, prefs, property);
                }}
              >
                +
              </button>
            </div>
          `;
        }
        if (typeof value === 'string') {
          return html`
            <label>${source}</label>
            <input
              type="text"
              .value=${value}
              @change=${(ev: any) => {
                this.#updateValue(source, ev.target.checked, prefs, property);
              }}
            />
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
