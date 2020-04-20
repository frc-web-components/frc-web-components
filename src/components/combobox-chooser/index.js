import { Webbit, html, css } from '@webbitjs/webbit';

class ComboboxChooser extends Webbit {

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
    `;
  }

  static get properties() {
    return {
      name: { type: String },
      selected: { type: String },
      default: { type: String },
      options: { type: Array }
    };
  }

  constructor() {
    super();
    this.options = [];
    this.selected = '';
    this.name = '';
    this.default = '';
  }

  onChange(ev) {
    this.selected = ev.detail.value;
  }

  render() {
    return html`
      <vaadin-combo-box 
        label="${this.name}" 
        .items="${this.options}" 
        .value="${this.selected || this.default}"
        @selected-item-changed="${this.onChange}"
      >
      </vaadin-combo-box>
    `;
  }
}

webbitRegistry.define('frc-combobox-chooser', ComboboxChooser);
