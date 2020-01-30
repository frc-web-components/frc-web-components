import { Widget, html, css } from '@lit-dashboard/lit-dashboard';
import { registerWidget } from '@lit-dashboard/lit-dashboard/app';

class ComboboxChooser extends Widget {

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
    `;
  }

  static get properties() {
    return {
      name: { type: String, reflect: true },
      selected: { type: String, reflect: true },
      default: { type: String, reflect: true },
      options: { type: Array, reflect: true }
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

registerWidget('combobox-chooser', {
  class: ComboboxChooser,
  label: 'ComboBox Chooser',
  category: 'FRC',
  image: require.resolve('./combobox-chooser.png')
});