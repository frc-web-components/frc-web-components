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
      default: { type: String, defaultValue: '' },
      command: { type: String, defaultValue: '' },
      hasCommand: { type: Boolean, defaultValue: false },
      hasDefault: { type: Boolean, defaultValue: false },
      name: { type: String, defaultValue: '' },
      hideName: { type: Boolean, defaultValue: false }
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
        <header>${this.name}</header>
      ` : ''}
      <div class="subsystem">
        <p>Default command: ${this.renderValue(this.default, this.hasDefault)}</p>
        <p>Current command: ${this.renderValue(this.command, this.hasCommand)}</p>
      </div>
    `;
  }
}

define('frc-robot-subsystem', Subsystem);