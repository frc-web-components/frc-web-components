import { Webbit, html, css } from '@webbitjs/webbit';

class TextView extends Webbit {

  static get styles() {
    return css`
      :host {
        display: inline-block;
        font-size: 18px;
        font-weight: normal;
        color: black;
        width: 200px;
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

  static get properties() {
    return {
      value: { type: Object, primary: true }
    };
  }

  constructor() {
    super();
    this.value = '';
  }

  onChange(ev) {
    const value = ev.target.value;

    if (typeof this.value === 'string') {
      this.value = value;
    }
    else if (typeof this.value === 'number') {
      this.value = parseFloat(value);
    }
    else if (typeof this.value === 'boolean') {
      if (value === 'true') {
        this.value = true;
      } else if (value === 'false') {
        this.value = false;
      }
    }
    else if (this.value instanceof Array) {
      try {
        const parsedValue = JSON.parse(value);
        if (parsedValue instanceof Array) {
          this.value = parsedValue;
        }
      } catch (e) {}
    }
  }

  render() {
    return html`   
      <input
        part="input"
        type="${typeof this.value === 'number' ? 'number' : 'text'}"
        @change="${this.onChange}"
        .value="${this.value instanceof Array 
          ? JSON.stringify(this.value) 
          : this.value.toString()}"
      />
    `;
  }
}

webbitRegistry.define('frc-text-view', TextView);