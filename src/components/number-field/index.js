import { Webbit, html, css } from '@webbitjs/webbit';
import { ifDefined } from 'lit-html/directives/if-defined';

import TextField from '../text-field';

class NumberField extends TextField {

  static get properties() {
    return {
      ...super.properties,
      value: { type: Number, primary: true },
      hasControls: { type: Boolean, attribute: 'has-controls' }, 
      min: { type: Number },
      max: { type: Number },
      step: { type: Number }
    }
  }

  constructor() {
    super();
    this.value = '';
    this.hasControls = false;
    // Min and max can't -Infinity, Infinity, Number.MIN_NUMBER, Number.MAX_NUMBER,
    // undefined, empty string, etc. or controls (appear with has-controls attribute)
    // don't work for whatever reason. Had to set them to some arbitrary large and
    // small numbers. 
    this.min = -9999999999999;
    this.max = 9999999999999;
    this.step = '';
  }

  onChange(ev) {
    const input = ev.target || ev.path[0];
    this.value = parseFloat(input.value);
  }

  renderWithStep() {
    return html`   
      <vaadin-number-field 
        part="input"
        exportparts="label, input-field, value, error-message"
        value="${this.value}"
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
        min="${this.min}"
        max="${this.max}"
        step="${this.step}"
        ?has-controls="${this.hasControls}"
      >
        <span slot="prefix"><slot name="prefix"></slot></span>
        <span slot="suffix"><slot name="suffix"></slot></span>
      </vaadin-number-field>
    `;
  }

  renderWithoutStep() {
    return html`   
      <vaadin-number-field 
        part="input"
        exportparts="label, input-field, value, error-message"
        value="${this.value}"
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
        min="${this.min}"
        max="${this.max}"
        ?has-controls="${this.hasControls}"

      >
        <span slot="prefix"><slot name="prefix"></slot></span>
        <span slot="suffix"><slot name="suffix"></slot></span>
      </vaadin-number-field>
    `;
  }

  render() {
    // When step attribute is rendered, even if it is undefined, 0, etc,
    // validation error happens for any number. Need two versions, one
    // with and one without attribute.
    return html`   
        ${this.step ? this.renderWithStep() : this.renderWithoutStep()}
    `;
  }
}

webbitRegistry.define('frc-number-field', NumberField);