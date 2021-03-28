import { html } from 'lit-element';
import { define } from '../../webbit';
import TextField from '../text-field';

class NumberField extends TextField {

  static get dashboardConfig() {
    return {
      displayName: 'Number Field',
      category: 'Forms & Inputs',
      // description: 'A group of checkboxes',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      slots: [],
      editorTabs: ['properties', 'sources'],
      resizable: { left: true, right: true },
    };
  }

  static get properties() {
    return {
      ...super.properties,
      value: { 
        type: Number, 
        defaultValue: null,
        primary: true,
        get() {
          return typeof this._value === 'number' 
            ? parseFloat(this._value.toFixed(this.precision))
            : this._value;
        }
      },
      hasControls: { type: Boolean, attribute: 'has-controls' }, 
      min: { type: Number, defaultValue: null },
      max: { type: Number, defaultValue: null },
      step: { type: Number, defaultValue: null },
      precision: { 
        type: Number,
        defaultValue: 2,
        get() {
          return Math.max(0, this._precision);
        }
      },
    }
  }

  onChange(ev) {
    const input = ev.target || ev.path[0];
    this.value = parseFloat(input.value);
  }

  firstUpdated() {
    this.inputField = this.shadowRoot.querySelector('[part=input]');
  }

  updated(changedProps) {

    ['min', 'max', 'value', 'step'].forEach(prop => {

      if (!changedProps.has(prop)) {
        return;
      }


      const value = this[prop];
      if (typeof value !== 'number' || isNaN(value)) {
        this.inputField.removeAttribute(prop);
      } else {
        this.inputField.setAttribute(prop, value);
      }
    });
  } 

  render() {
    return html`   
      <vaadin-number-field 
        part="input"
        exportparts="label, input-field, value, error-message"
        label="${this.label}"
        placeholder="${this.placeholder}"
        ?disabled="${this.disabled}"
        ?readonly="${this.readonly}"
        ?autoselect="${this.autoselect}"
        ?clear-button-visible="${this.clearButtonVisible}"
        ?required="${this.required}"
        minlength="${this.minlength}"
        maxlength="${this.maxlength}"
        error-message="${this.errorMessage}"
        pattern="${this.pattern}"
        ?prevent-invalid-input="${this.preventInvalidInput}"
        theme="${this.theme}"
        @change="${this.onChange}"
        ?has-controls="${this.hasControls}"
      >
        <span slot="prefix"><slot name="prefix"></slot></span>
        <span slot="suffix"><slot name="suffix"></slot></span>
      </vaadin-number-field>
    `;
  }
}

define('frc-number-field', NumberField);