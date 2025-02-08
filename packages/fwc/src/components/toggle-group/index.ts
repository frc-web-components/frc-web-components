import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export const toggleGroupDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Toggle Group',
  },
  properties: {
    options: {
      type: 'Array',
      changeEvent: 'optionsUpdate',
      defaultValue: ['On', 'Off'],
      input: { type: 'StringArray' },
    },
    value: {
      primary: true,
      type: 'String',
      changeEvent: 'change',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions({ options }: { options: string[] }): string[] {
          return options;
        },
      },
    },
    direction: {
      type: 'String',
      defaultValue: 'vertical',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions(): string[] {
          return ['vertical', 'horizontal'];
        },
      },
    },
  },
};

export class ToggleGroup extends LitElement {
  @property({ type: Array }) options = ['On', 'Off'];
  @property({ type: String }) value = '';
  @property({ type: String }) direction = 'vertical';

  static styles = css`
    :host {
      display: inline-flex;
      flex-direction: column;
      width: 150px;
      height: 300px;
      gap: 0;
      font-family: sans-serif;
      font-size: 16px;
      letter-spacing: 0.5px;
    }

    button {
      width: 100%;
      height: 100%;
      margin: 0;
      border: none;
      font-size: inherit;
      font-family: inherit;
      letter-spacing: inherit;
      background: var(--frc-button-background-color, rgb(230, 230, 230));
      color: var(--frc-button-text-color, black);
      flex: 1;
    }

    .toggled {
      background: var(--frc-button-toggled-background-color, black);
      color: var(--frc-button-toggled-text-color, white);
      font-weight: bold;
    }

    [part='button'] {
      border-radius: 0;
      margin: 0;
      flex: 1;
      font-size: inherit;
      height: 100%;
      padding: 0;
    }
  `;

  async setValue(value: string): Promise<void> {
    this.value = value;
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('options') && !this.options.includes(this.value)) {
      this.value = this.options[0] ?? '';
    }

    // dispatch events
    if (changedProps.has('value')) {
      this.#dispatchChange();
    }

    if (changedProps.has('options')) {
      this.#dispatchOptionsUpdate();
    }

    if (changedProps.has('direction')) {
      this.style.setProperty(
        'flex-direction',
        this.direction === 'vertical' ? 'column' : 'row',
      );
    }
  }

  #dispatchChange(): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #dispatchOptionsUpdate(): void {
    this.dispatchEvent(
      new CustomEvent('optionsUpdate', {
        detail: { options: this.options },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render(): TemplateResult {
    return html`
      ${this.options.map(
        (option) => html`
          <button
            class="${this.value === option ? 'toggled' : ''}"
            @click="${() => this.setValue(option)}"
          >
            ${option}
          </button>
        `,
      )}
    `;
  }
}

export default ToggleGroup;

if (!customElements.get('frc-toggle-group')) {
  customElements.define('frc-toggle-group', ToggleGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-toggle-group': ToggleGroup;
  }
}
