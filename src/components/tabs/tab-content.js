import { html, css } from 'lit-element';
import { define, Webbit } from '../../webbit';

class TabContent extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Tab Content',
      category: 'Tabs',
      // description: 'A group of checkboxes',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      allowedParents: ['frc-tabs-content'],
      dashboardHtml: `
        <frc-tab-content>
          <frc-label text="Content for tab"></frc-label>
        </frc-tab-content>
      `
    };
  }

  static get styles() {
    return css`
      :host {
        display: none;
        width: 100%;
        height: 100%;
        position: relative;
      }

      ::slotted(*) {
        position: absolute;
      }
    `;
  }

  static get properties() {
    return {
      selected: { type: Boolean, primary: true }
    };
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

define('frc-tab-content', TabContent);