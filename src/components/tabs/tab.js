import { Webbit, html, css } from '@webbitjs/webbit';


class Tab extends Webbit {

  static get metadata() {
    return {
      displayName: 'Tab',
      category: 'Tabs',
      // description: 'A group of checkboxes',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      slots: [],
      allowedParents: ['frc-tabs'],
      resizable: {},
      movable: false
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
    `;
  }

  static get properties() {
    return {
      selected: { type: Boolean, primary: true },
      disabled: { type: Boolean },
      label: { type: String }
    };
  }

  constructor() {
    super();
    this.selected = false;
    this.disabled = false;
    this.label = 'Tab';
  }

  firstUpdated() {
    super.firstUpdated();
 
    const observer = new MutationObserver(() => {
      this.dispatchChangeEvent();    
    });
    
    observer.observe(this, {
      childList: true,
      characterData: true,
      subtree: true

    });
  }
  

  dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent('change'));
  }

  updated() {
    this.dispatchChangeEvent();
  }

  updateStyles() {
    const tab = this.shadowRoot.querySelector('vaadin-tab');
    tab.updateStyles();
  }


  render() {
    return html`
      <vaadin-tab ?selected="${this.selected}" ?disabled="${this.disabled}">
        ${this.label}
      </vaadin-tab>
    `;
  }
}

webbitRegistry.define('frc-tab', Tab);