import { Webbit, html, css } from '@webbitjs/webbit';


class TabContent extends Webbit {

  static get metadata() {
    return {
      displayName: 'Tab Content',
      category: 'Layout',
      // description: 'A group of checkboxes',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      allowedParents: ['frc-tabs-content']
    };
  }

  static get styles() {
    return css`
      :host {
        display: none;
      }
    `;
  }

  static get properties() {
    return {
      selected: { type: Boolean, primary: true }
    };
  }

  constructor() {
    super();
    this.selected = false;
  }

  dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent('change'));
  }

  
  updated() {
    this.dispatchChangeEvent();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

webbitRegistry.define('frc-tab-content', TabContent);