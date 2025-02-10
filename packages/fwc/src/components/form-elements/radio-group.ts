import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export const radioGroupDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Radio Group',
    defaultHtml: `
      <frc-radio-group options='["1", "2", "3"]'>
      </frc-radio-group>
    `,
  },
  properties: {
    disabled: { type: 'Boolean', reflect: true },
    label: { type: 'String' },
    options: { type: 'Array' },
    selected: { type: 'String', changeEvent: 'change', primary: true },
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

export class RadioGroup extends LitElement {
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) label = '';
  @property({ type: Array }) options: string[] = [];
  @property({ type: String }) selected = '';
  @property({ type: String }) direction: 'vertical' | 'horizontal' = 'vertical';

  static styles = css`
    :host {
      display: inline-block;
    }
  `;

  #onChange(ev: CustomEvent) {
    this.selected = ev.detail.value;
    const event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { selected: this.selected },
    });

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <vaadin-radio-group
        @value-changed=${(ev: CustomEvent) => this.#onChange(ev)}
        .disabled=${this.disabled}
        .label=${this.label}
        theme=${this.direction}
        .value=${this.selected}
      >
        ${this.options.map(
          (value) => html`
            <vaadin-radio-button value=${value}>${value}</vaadin-radio-button>
          `,
        )}
      </vaadin-radio-group>
    `;
  }
}

export default RadioGroup;

if (!customElements.get('frc-radio-group')) {
  customElements.define('frc-radio-group', RadioGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-radio-group': RadioGroup;
  }
}
