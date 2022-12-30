/* eslint-disable import/extensions */
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import FrcDashboard from '../frc-dashboard';

@customElement('dashboard-settings-dialog')
export class SettingsDialog extends LitElement {
  @property({ type: Object, attribute: false }) dashboard!: FrcDashboard;
  @state() theme = '';
  @state() themes: string[] = [];
  @state() serverAddress = '';

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      width: 350px;
    }

    .form {
      flex: 1;
      width: 100%;
      padding: 15px 20px;
      box-sizing: border-box;
    }

    .form-item {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .form-item label {
      width: 100px;
    }

    .form-item .input {
      flex: 1;
    }
  `;

  onClose(): void {
    this.dispatchEvent(
      new CustomEvent('closeDialog', {
        bubbles: true,
        composed: true,
      })
    );
  }

  firstUpdated(): void {
    this.theme = this.dashboard.getTheme();
    this.themes = this.dashboard.getThemes();

    this.dashboard.subscribe('themeSet', () => {
      this.theme = this.dashboard.getTheme();
    });

    this.dashboard.subscribe('themeRulesAdd', () => {
      this.themes = this.dashboard.getThemes();
    });

    const ntProvider = this.dashboard
      .getStore()
      .getSourceProvider('NetworkTables');
    this.serverAddress = (ntProvider as any).getServerAddress();
  }

  private onThemeChange(ev: CustomEvent): void {
    const input = ev.target || (ev as any).path[0];
    this.dashboard.setTheme(input.value);
  }

  private onAddressChange(ev: CustomEvent): void {
    const { value } = ev.target as any;
    const ntProvider = this.dashboard
      .getStore()
      .getSourceProvider('NetworkTables');
    (ntProvider as any).connect(value);
    this.serverAddress = value;
  }

  render(): TemplateResult {
    const items = this.dashboard.getThemes().map((theme) => ({
      id: theme,
      name: theme,
    }));

    return html`
      <header
        style="border-bottom: 1px solid var(--lumo-contrast-10pct); padding: var(--lumo-space-m) var(--lumo-space-l);"
      >
        <h2
          style="font-size: var(--lumo-font-size-xl); font-weight: 600; line-height: var(--lumo-line-height-xs); margin: 0;"
        >
          Dashboard Settings
        </h2>
      </header>
      <div class="form">
        <div class="form-item">
          <label>Theme</label>
          <vaadin-combo-box
            class="input"
            item-label-path="name"
            item-value-path="id"
            .items=${items}
            .value=${this.theme}
            @change=${this.onThemeChange}
          ></vaadin-combo-box>
        </div>
        <div class="form-item">
          <label>NT4 Server</label>
          <vaadin-text-field
            class="input"
            .value=${this.serverAddress}
            @change=${this.onAddressChange}
          ></vaadin-text-field>
        </div>
      </div>
      <footer
        style="padding: var(--lumo-space-s) var(--lumo-space-m); text-align: right;"
      >
        <vaadin-button
          theme="tertiary"
          style="margin-inline-end: var(--lumo-space-m);"
          @click="${() => {
            this.onClose();
          }}"
        >
          Close
        </vaadin-button>
      </footer>
    `;
  }
}
