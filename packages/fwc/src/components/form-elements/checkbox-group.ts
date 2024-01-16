import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export const checkboxGroupDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Checkbox Group',
    defaultHtml: `
      <frc-checkbox-group options='["1", "2", "3"]'>
      </frc-checkbox-group>
    `,
  },
  properties: {
    disabled: { type: 'Boolean', reflect: true },
    label: { type: 'String' },
    options: { type: 'Array' },
    selected: { type: 'Array', changeEvent: 'change', primary: true },
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

export class CheckboxGroup extends LitElement {
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) label = '';
  @property({ type: Array }) options: string[] = [];
  @property({ type: Array }) selected: string[] = [];
  @property({ type: String }) direction: 'vertical' | 'horizontal' = 'vertical';

  static styles = css`
    :host {
      display: inline-block;
    }
  `;

  // eslint-disable-next-line class-methods-use-this
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
      <vaadin-checkbox-group
        @value-changed=${(ev: CustomEvent) => this.#onChange(ev)}
        .disabled=${this.disabled}
        .label=${this.label}
        theme=${this.direction}
        .value=${this.selected}
      >
        ${this.options.map(
          (value) => html`
            <vaadin-checkbox value=${value}>${value}</vaadin-checkbox>
          `
        )}
      </vaadin-checkbox-group>
    `;
  }
}

export default CheckboxGroup;

if (!customElements.get('frc-checkbox-group')) {
  customElements.define('frc-checkbox-group', CheckboxGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-checkbox-group': CheckboxGroup;
  }
}
