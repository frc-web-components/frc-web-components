import { LitElement, html, css } from 'lit-element';

 /**
 * Component for displaying the state of a command based subsystem.
 *
 * @attr {String} default - The default command for the subsystem.
 * @attr {String} command - The current command for the subsystem.
 */
class BasicSubsystem extends LitElement {

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
        font-family: sans-serif;
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
      default: { type: String, reflect: true },
      command: { type: String, reflect: true }
    };
  }

  constructor() {
    super();
    this.default = 'None';
    this.command = 'None';
  }

  render() {
    return html`
      <p>Default command: ${this.default || 'None'}</p>
      <p>Current command: ${this.command || 'None'}</p>
    `;
  }
}

customElements.define('frc-basic-subsystem', BasicSubsystem);

webbitRegistry.addExisting('frc-basic-subsystem', {
  displayName: 'Basic Subsystem',
  category: 'Robot & Field Info',
  description: 'Component for displaying the state of a command based subsystem.',
  documentationLink: 'https://frc-web-components.github.io/components/basic-subsystem/',
  slots: [],
  resizable: { left: true, right: true },
  minSize: { width: 50, height: 10 },
  properties: {
    default: { type: String, defaultValue: 'None' },
    command: { type: String, defaultValue: 'None' }
  }
});