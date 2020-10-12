import { Webbit, html, css } from '@webbitjs/webbit';


class TabsContent extends Webbit {

  static get metadata() {
    return {
      displayName: 'Tabs Content',
      category: 'Tabs',
      // description: 'A group of checkboxes',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      allowedChildren: ['frc-tab-content'],
      layout: 'none',
      dashboardHtml: `
        <frc-tabs-content>
          <frc-tab-content>
            <frc-label text="Content for tab 1"></frc-label>
          </frc-tab-content>
          <frc-tab-content>
            <frc-label text="Content for tab 2"></frc-label>
          </frc-tab-content>
        </frc-tabs-content>
      `
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 200px;
        height: 200px;
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
    super.firstUpdated();
    this.slotElement = this.shadowRoot.querySelector('slot'); 
    this.slotElement.addEventListener('slotchange', () => {
      this.updateContents();
      this.updateSelected();
    });
    this.updateContents();
  }

  updateSelected() {
    this.contents.forEach((content, index) => {
      content.selected = this.selected === index;
      content.style.display = this.selected === index ? 'block' : 'none';
    });
  }

  updated() {
    this.updateSelected();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

webbitRegistry.define('frc-tabs-content', TabsContent);