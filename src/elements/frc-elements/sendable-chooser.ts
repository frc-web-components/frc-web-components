/* eslint-disable import/extensions */
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export default {
  defaultSourceKey: '/SmartDashboard/Auto choices',
  defaultSourceProvider: 'NetworkTables',
  dashboard: {
    displayName: 'Sendable Chooser',
  },
  properties: {
    options: { type: 'Array' },
    selected: {
      type: 'String',
      changeEvent: 'change',
      primary: true,
    },
    active: { type: 'String' },
    label: { type: 'String', defaultValue: 'Auto Choices' },
  },
};

@customElement('frc-sendable-chooser')
export class SendableChooser extends LitElement {
  @property({ type: Array }) options: string[] = [];
  @property({ type: String }) selected = '';
  @property({ type: String }) active = '';
  @property({ type: String }) label = 'Auto Choices';

  static styles = css`
    :host {
      display: inline-block;
      min-width: 220px;
    }

    .container {
      display: flex;
      align-items: flex-end;
      gap: 7px;
      width: 100%;
    }

    vaadin-combo-box {
      flex: 1;
    }

    vaadin-icon {
      width: 20px;
      height: 20px;
      margin-bottom: 12px;
    }

    vaadin-icon[icon='vaadin:check'] {
      color: green;
    }

    vaadin-icon[icon='vaadin:exclamation'] {
      color: red;
    }
  `;

  onChange(ev: Event): void {
    this.selected = (ev as any).detail.value;
    this.#dispatchChange();
  }

  #dispatchChange(): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { selected: this.selected },
        bubbles: true,
        composed: true,
      })
    );
  }

  render(): TemplateResult {
    return html`
      <div class="container">
        <vaadin-combo-box
          .items=${this.options}
          value=${this.selected}
          label=${this.label}
          @value-changed=${this.onChange}
        ></vaadin-combo-box>
        ${this.options.length > 0
          ? html`
              ${this.selected === this.active
                ? html`<vaadin-icon icon="vaadin:check"></vaadin-icon>`
                : html`<vaadin-icon icon="vaadin:exclamation"></vaadin-icon>`}
            `
          : ''}
      </div>
    `;
  }
}
