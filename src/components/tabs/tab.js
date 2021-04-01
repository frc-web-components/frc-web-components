import { html, css } from 'lit-element';
import { define, Webbit } from '../../webbit';

class Tab extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Tab',
      category: 'Tabs',
      // description: 'A group of checkboxes',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      slots: [],
      allowedParents: ['frc-tabs'],
      resizable: {},
      movable: false,
      dashboardHtml: `
        <frc-tab label="Tab"></frc-tab>
      `
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

  firstUpdated() { 
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

define('frc-tab', Tab);