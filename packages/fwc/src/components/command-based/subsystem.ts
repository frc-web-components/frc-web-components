import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export const robotSubsystemDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Subsystem',
  },
  properties: {
    default: { type: 'String' },
    command: { type: 'String' },
    hasCommand: { type: 'Boolean', attribute: 'has-command' },
    hasDefault: { type: 'Boolean', attribute: 'has-default' },
    label: { type: 'String' },
    name: { type: 'String' },
    hideName: { type: 'Boolean', attribute: 'hide-name' },
  },
};

export class RobotSubsystem extends LitElement {
  @property({ type: String }) default = '';
  @property({ type: String }) command = '';
  @property({ type: Boolean, attribute: 'has-command' }) hasCommand = false;
  @property({ type: Boolean, attribute: 'has-default' }) hasDefault = false;
  @property({ type: String }) label = '';
  @property({ type: String }) name = '';
  @property({ type: Boolean, attribute: 'hide-name' }) hideName = false;

  static styles = css`
    :host {
      display: inline-block;
      font-family: sans-serif;
      font-size: 16px;
      padding: 5px;
      color: var(--frc-label-text-color, black);
    }

    .subsystem {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
    }

    p {
      margin: 0;
      margin-right: 10px;
      margin-top: 5px;
    }

    header {
      font-weight: bold;
      margin-bottom: 2px;
      color: var(--frc-robot-subsystem-header-color, purple);
    }

    .has-value {
      color: green;
    }

    .no-value {
      color: red;
    }
  `;

  static renderValue(value: string, hasValue: boolean): TemplateResult {
    if (hasValue) {
      return html`<span class="has-value">${value}</span>`;
    }

    return html`<span class="no-value">None</span>`;
  }

  render(): TemplateResult {
    return html`
      ${!this.hideName
        ? html` <header>${this.label || this.name}</header> `
        : ''}
      <div class="subsystem">
        <p>
          Default command:
          ${RobotSubsystem.renderValue(this.default, this.hasDefault)}
        </p>
        <p>
          Current command:
          ${RobotSubsystem.renderValue(this.command, this.hasCommand)}
        </p>
      </div>
    `;
  }
}

if (!customElements.get('frc-robot-subsystem')) {
  customElements.define('frc-robot-subsystem', RobotSubsystem);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-robot-subsystem': RobotSubsystem;
  }
}
