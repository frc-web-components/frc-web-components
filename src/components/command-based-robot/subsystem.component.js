import { html, css } from 'lit-element';
import { Webbit, define } from '../../webbit';

class Subsystem extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Robot Subsytem',
      category: 'Command Based Robot',
      description: 'Component for displaying the state of a command based subsystem.',
    //   documentationLink: 'https://frc-web-components.github.io/components/basic-subsystem/',
      slots: [],
      resizable: { left: true, right: true },
      minSize: { width: 200 }
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        font-family: sans-serif;
        font-size: 16px;
        padding: 5px;
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
        color: purple;
      }

      .has-value {
        color: green;
      }

      .no-value {
        color: red;
      }
    `;
  }

  static get properties() {
    return {
      default: { type: String },
      command: { type: String },
      hasCommand: { type: Boolean },
      hasDefault: { type: Boolean },
      label: { type: String },
      name: { type: String },
      hideName: { type: Boolean }
    };
  }

  renderValue(value, hasValue) {
    if (hasValue) {
      return html`<span class="has-value">${value}</span>`;
    }

    return html`<span class="no-value">None</span>`;
  }

  render() {
    return html`
      ${!this.hideName ? html`
        <header>${this.label || this.name}</header>
      ` : ''}
      <div class="subsystem">
        <p>Default command: ${this.renderValue(this.default, this.hasDefault)}</p>
        <p>Current command: ${this.renderValue(this.command, this.hasCommand)}</p>
      </div>
    `;
  }
}

define('frc-robot-subsystem', Subsystem);