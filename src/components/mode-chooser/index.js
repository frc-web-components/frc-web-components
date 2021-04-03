import { html, css } from 'lit-element';
import { define, Webbit } from '../../webbit';

class ModeChooser extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Mode Chooser',
      category: 'Forms & Inputs',
      //description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/relay/',
      slots: [],
      editorTabs: ['properties', 'sources'],
    };
  }

  static get styles() {
    return css`
      :host {
        font-size: 15px;
        display: inline-flex;
        flex-direction: column;
        width: 150px;
        height: 300px;
      }

      [part=button] {
        border-radius: 0;
        margin: 0;
        flex: 1;
        font-size: inherit;
        height: 100%;
      }
    `;
  }

  static get properties() {
    return {
      modes: { type: Array, defaultValue: ['On', 'Off'], inputType: 'StringArray' },
      value: {
        primary: true,
        type: String,
        inputType: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return this.modes;
        },
      },
      horizontal: { type: Boolean }
    };
  }

  setValue(value) {
    this.value = value;
  }

  render() {
    return html`   
      ${this.modes.map(mode => html`
        <vaadin-button
          part="button" 
          theme="contrast ${this.value == mode ? 'primary' : ''}" 
          @click="${() => this.setValue(mode)}"
        >
          ${mode}
        </vaadin-button>
      `)}
    `;
  }
}

define('frc-mode-chooser', ModeChooser);