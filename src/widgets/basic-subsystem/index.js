import { Widget, html, css } from '@lit-dashboard/lit-dashboard';
import { registerWidget } from '@lit-dashboard/lit-dashboard/app';

class BasicSubsystem extends Widget {

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
      <p>Default command: ${this.default}</p>
      <p>Current command: ${this.command}</p>
    `;
  }
}

registerWidget('basic-subsystem', {
  class: BasicSubsystem,
  label: 'Basic Subsystem',
  category: 'FRC',
  image: require.resolve('./basic-subsystem.png')
});