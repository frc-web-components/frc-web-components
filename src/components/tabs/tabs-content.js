import { Webbit, html, css } from '@webbitjs/webbit';


class TabsContent extends Webbit {

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  static get properties() {
    return {
      selected: { type: Number, primary: true }
    };
  }

  constructor() {
    super();
    this.selected = 0;
    this.contents = [];
    this.contentChangeEvents = new WeakMap();
    this.slotElement = null;
  }

  filterByContents(nodes) {
    return [...nodes].filter(node => node.tagName === 'FRC-TAB-CONTENT');
  }

  selectContent(value) {
    this.selected = value;
  }

  updateContents() {
    // remove old event listeners
    this.contents.forEach(content => {
      const event = this.contentChangeEvents.get(content);
      content.removeEventListener('change', event);
      this.contentChangeEvents.delete(content);
    });

    // add new event listeners
    this.contents = this.filterByContents(this.slotElement.assignedElements());
    this.contents.forEach((content, index) => {
      const event = () => {
        if (content.selected) {
          this.selectContent(index);
        }
      };
      this.contentChangeEvents.set(content, event);
      content.addEventListener('change', event);
    });
  }

  firstUpdated() {
    this.slotElement = this.shadowRoot.querySelector('slot'); 
    this.slotElement.addEventListener('slotchange', () => {
      this.updateContents();
    });
    this.updateContents();
  }

  updated() {
    this.contents.forEach((content, index) => {
      content.selected = this.selected === index;
      content.style.display = this.selected === index ? 'block' : 'none';
    });
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

webbitRegistry.define('frc-tabs-content', TabsContent);