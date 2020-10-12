import { Webbit, html, css } from '@webbitjs/webbit';
import './tab';
import './tab-content';
import './tabs-content';

class Tabs extends Webbit {

  static get metadata() {
    return {
      displayName: 'Tabs',
      category: 'Tabs',
      // description: 'A group of checkboxes',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      allowedChildren: ['frc-tab'],
      layout: 'none',
      resizable: { left: true, right: true },
      dashboardHtml: `
        <frc-tabs>
          <frc-tab label="Tab 1"></frc-tab>
          <frc-tab label="Tab 2"></frc-tab>
        </frc-tabs>
      `
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  static get properties() {
    return {
      selected: { type: Number, primary: true },
      orientation: { type: String },
      theme: { type: String }
    };
  }

  constructor() {
    super();
    this.selected = 0;
    this.orientation = 'horizontal';
    this.theme = '';
    this.tabs = [];
    this.tabChangeEvents = new WeakMap();
  }

  filterByTabs(nodes) {
    return [...nodes].filter(node => node.tagName === 'FRC-TAB');
  }

  selectTab(value) {
    this.selected = value;
  }

  updateTabs() {
    // remove old event listeners
    this.tabs.forEach(tab => {
      const event = this.tabChangeEvents.get(tab);
      tab.removeEventListener('change', event);
      this.tabChangeEvents.delete(tab);
    });

    // remove old tabs
    const vaadinTabs = this.shadowRoot.querySelector('vaadin-tabs');
    vaadinTabs.innerHTML = '';

    // add new tabs and events
    this.tabs = this.filterByTabs(this.childNodes);

    this.tabs.forEach((tab, index) => {
      const vaadinTab = document.createElement('vaadin-tab');
      vaadinTab.innerText = tab.label;
      vaadinTab.disabled = tab.disabled;
      vaadinTabs.appendChild(vaadinTab);

      const event = () => {
        vaadinTab.disabled = tab.disabled;
        vaadinTab.innerText = tab.label;
        if (tab.selected) {
          this.selectTab(index);
        }
      };

      this.tabChangeEvents.set(tab, event);
      tab.addEventListener('change', event);
    });
  }

  firstUpdated() {
    super.firstUpdated();
    const observer = new MutationObserver(() => {
      this.updateTabs();
    });
    observer.observe(this, {
      childList: true
    });
    this.updateTabs();
  }


  updateSelected() {
    this.tabs.forEach((tab, index) => {
      tab.selected = (this.selected === index);
    });
  }

  updated(changeProperties) {
    if (changeProperties.has('selected')) {
      this.updateSelected();
    }
  }

  onSelectedChange(ev) {
    const target = ev.target || ev.path[0];
    this.selectTab(target.selected);
  }

  render() {
    return html`
      <vaadin-tabs 
        selected="${this.selected}"
        orientation="${this.orientation}"
        theme="${this.theme}"
        @selected-changed="${this.onSelectedChange}"
      ></vaadin-tabs>
    `;
  }
}

webbitRegistry.define('frc-tabs', Tabs);