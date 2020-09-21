import { Webbit, html, css } from '@webbitjs/webbit';


class Tab extends Webbit {

  static get metadata() {
    return {
      displayName: 'Tab',
      category: 'Layout',
      // description: 'A group of checkboxes',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      slots: [],
      allowedParents: ['frc-tabs']
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
    };
  }

  constructor() {
    super();
    this.selected = false;
    this.disabled = false;
  }

  getText() {
    const slot = this.shadowRoot.querySelector('slot');

    if (!slot) {
      return '';
    }

    const [node] = slot.assignedNodes();
    return node ? node.textContent : '';
  }

  firstUpdated() {
    super.firstUpdated();
    const slot = this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', (e) => {
      this.dispatchChangeEvent();
    });

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
        <slot></slot>
      </vaadin-tab>
    `;
  }
}

webbitRegistry.define('frc-tab', Tab);