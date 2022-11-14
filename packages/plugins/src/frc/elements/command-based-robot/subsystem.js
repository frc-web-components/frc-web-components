import { html, css, LitElement } from 'lit';

export const elementName = 'frc-robot-subsystem';

export const elementConfig = {
  dashboard: {
    displayName: 'Subsystem',
  },
  properties: {
    default: { type: String },
    command: { type: String },
    hasCommand: { type: Boolean, attribute: 'has-command' },
    hasDefault: { type: Boolean, attribute: 'has-default' },
    label: { type: String },
    name: { type: String },
    hideName: { type: Boolean, attribute: 'hide-name' },
  },
};

class Subsystem extends LitElement {
  static properties = elementConfig.properties;

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

  renderValue(value, hasValue) {
    if (hasValue) {
      return html`<span class="has-value">${value}</span>`;
    }

    return html`<span class="no-value">None</span>`;
  }

  render() {
    return html`
      ${!this.hideName
        ? html` <header>${this.label || this.name}</header> `
        : ''}
      <div class="subsystem">
        <p>
          Default command: ${this.renderValue(this.default, this.hasDefault)}
        </p>
        <p>
          Current command: ${this.renderValue(this.command, this.hasCommand)}
        </p>
      </div>
    `;
  }
}

customElements.define(elementName, Subsystem);
