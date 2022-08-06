import { html, css, LitElement } from 'lit';

export const elementName = 'frc-toggle-group';

export const elementConfig = {
  dashboard: {
    displayName: 'Toggle Group',
  },
  properties: {
    options: {
      type: Array,
      changeEvent: 'optionsUpdate',
      defaultValue: ['On', 'Off'],
      input: { type: 'StringArray' }
    },
    value: {
      primary: true,
      type: String,
      changeEvent: 'change',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return this.options;
        },
      }
    },
  }
};

class ToggleGroup extends LitElement {

  static properties = elementConfig.properties;

  static styles = css`
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

  constructor() {
    super();
    this.options = ['On', 'Off'];
  }

  async setValue(value) {
    this.value = value;
  }

  updated(changedProps) {
    if (changedProps.has('options') && !this.options.includes(this.value)) {
      this.value = this.options[0] ?? '';
    }

    // dispatch events
    if (changedProps.has('value')) {
      this.#dispatchChange();
    }

    if (changedProps.has('options')) {
      this.#dispatchOptionsUpdate();
    }
  }

  #dispatchChange() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  #dispatchOptionsUpdate() {
    this.dispatchEvent(new CustomEvent('optionsUpdate', {
      detail: { options: this.options },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`   
      ${this.options.map(option => html`
      <vaadin-button part="button" theme="contrast ${this.value == option ? 'primary' : ''}"
        @click="${() => this.setValue(option)}">
        ${option}
      </vaadin-button>
      `)}
    `;
  }
}

customElements.define(elementName, ToggleGroup);