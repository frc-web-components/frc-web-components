import { html, css } from 'lit-element';
import { Webbit, define } from '../../webbit';

 /**
 * Component for displaying the state of a command based subsystem.
 *
 * @attr {String} default - The default command for the subsystem.
 * @attr {String} command - The current command for the subsystem.
 */
class BasicSubsystem extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Basic Subsystem',
      category: 'Robot & Field Info',
      description: 'Component for displaying the state of a command based subsystem.',
      documentationLink: 'https://frc-web-components.github.io/components/basic-subsystem/',
      slots: [],
      resizable: { left: true, right: true },
      minSize: { width: 50, height: 10 }
    };
  }

  static get styles() {
    return css`
      :host {
        text-align: left;
        font-weight: normal;
        display: inline-block;
      }

      p {
        margin: 0;
      }

      p:first-child {
        margin-bottom: 5px;
      }
    `;
  }

  static get properties() {
    return {
      default: { type: String, defaultValue: 'None' },
      command: { type: String, defaultValue: 'None' }
    };
  }

  render() {
    return html`
      <p>Default command: ${this.default}</p>
      <p>Current command: ${this.command}</p>
    `;
  }
}

define('frc-basic-subsystem', BasicSubsystem);