import { Widget, html, css } from '@lit-dashboard/lit-dashboard';
import { registerWidget } from '@lit-dashboard/lit-dashboard/app';

class ComboboxChooser extends Widget {

  static get properties() {
    return {
      label: { type: String },
      selected: { type: Object },
      options: { type: Array }
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
    `;
  }

  constructor() {
    super();
    this.options = [];
    this.selected = '';
    this.label = '';
  }

  onChange(ev) {
    if (this.hasSource()) {
      const value = ev.detail.value;
      this.sourceValue.selected = value;
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('sourceValue')) {
      this.options = this.sourceValue.options || [];
      this.label = this.sourceValue.name || '';
      this.selected = 
        this.sourceValue.selected 
        || this.sourceValue.default
        || '';
    }
  }

  render() {
    return html`
      <vaadin-combo-box 
        label="${this.label}" 
        .items="${this.options}" 
        .value="${this.selected}"
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
  acceptedTypes: ['String Chooser'],
  image: require.resolve('./combobox-chooser.png')
});