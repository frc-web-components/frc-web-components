import { Webbit, html, css } from '@webbitjs/webbit';

class TextView extends Webbit {

  static get styles() {
    return css`
      :host {
        height: 100%;
        display: block;
        font-size: 18px;
        font-weight: normal;
        color: black;
      }

      input {
        width: 100%;
        border: none;
        outline: none;
        border-bottom: 2px solid lightgray;
        padding-bottom: 5px;
        background: none;
        font: inherit;
        color: inherit;
      }

      input:focus {
        border-bottom: 2px solid lightblue;
      }
    `;
  }
  
  getInputType() {
    return this.sourceType === 'Number' ? 'number' : 'text';
  }

  getInputValue() {
    return this.hasAcceptedType() ? this.sourceValue.toString() : '';
  }

  onChange(ev) {
    const value = ev.target.value;

    if (this.sourceType === 'String') {
      this.sourceValue = value;
    }
    else if (this.sourceType === 'Number') {
      this.sourceValue = parseFloat(value);
    }
    else if (this.sourceType === 'Boolean') {
      if (value === 'true') {
        this.sourceValue = true;
      } else if (value === 'false') {
        this.sourceValue = false;
      }
    }
  }

  render() {
    return html`   
      <input
        part="input"
        type="${this.getInputType()}"
        @change="${this.onChange}"
        .value="${this.getInputValue()}"
      />
    `;
  }
}

webbitRegistry.define('frc-text-view', TextView);