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

  render() {
    return html`
      <p>Default command: ${this.sourceValue.default || 'None'}</p>
      <p>Current command: ${this.sourceValue.command || 'None'}</p>
    `;
  }
}

registerWidget('basic-subsystem', {
  class: BasicSubsystem,
  label: 'Basic Subsystem',
  category: 'FRC',
  acceptedTypes: ['Subsystem'],
  image: require.resolve('./basic-subsystem.png')
});