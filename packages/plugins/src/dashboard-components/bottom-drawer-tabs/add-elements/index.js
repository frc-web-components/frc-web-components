import { LitElement, html, css } from 'lit';
import {keyed} from 'lit/directives/keyed.js';
import getElementHtml from './get-element-html';
import Iconify from '@iconify/iconify';

const styles = css`
  :host {
    display: block;
    font-family: sans-serif;
    font-size: 16px;
    padding: 15px 10px;
    --vaadin-app-layout-transition: 0;
  }

  p {
    margin-top: 0;
    font-weight: bold;
    margin-bottom: 5px;
  }

  p span {
    color: purple;
  }

  .add-buttons {
    margin-top: 10px;
  }

  .input-fields {
    display: flex;
  }

  .input-fields > * {
    flex: 1;
  }

  .input-fields .input-field + .input-field {
    margin-left: 7px;
  }

  vaadin-combo-box:part(input-field) {
    transition: none;
  }

  .component-selector {
    --vaadin-combo-box-overlay-width: 380px;
  }

  .component-item {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    height: 70px;
    border: 1px solid #ddd;
    margin-bottom: 5px;
    padding: 5px;
  }

  .info {
    cursor: grab;
    flex: 1;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-around;
  }

  button {  
    background: white;
    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
  }

  .iconify {
    color: black;
    width: 20px;
    height: 20px;
  }

  .description {
    font-size: 15px;
    padding-right: 5px;
  }
`;

class AddElements extends LitElement {

  #onDragOverParent;
  #parentDragPosition;
  #symbol = Symbol();

  static styles = styles;

  static properties = {
    interact: { type: Object },
    _slot: { state: true },
    _searchInput: { state: true },
    dashboard: { attribute: false },
    selectedCategory: { state: true }
  };

  constructor() {
    super();
    this.interact = null;
    this._slot = '';
    this._searchInput = '';
    this.#onDragOverParent = null;
    this.#parentDragPosition = null;
  }

  get element() {
    return this.dashboard.getSelectedElement();
  }

  firstUpdated() {
    this.#removeAnnoyingAnimation();
    this.dashboard.subscribe('elementSelect', (e) => {
      const allowedChildren = this.dashboard.getAllowedChildren()[0];
      this._slot = allowedChildren?.slot;
      this._searchInput = '';
      this.#symbol = Symbol();
      this.requestUpdate();
    });
  }

  updated() {
    Iconify.scan(this.renderRoot);
  }

  // This is a hack to remove an annoying animation between readonly and disabled states
  #removeAnnoyingAnimation() {
    this.renderRoot.querySelectorAll('vaadin-combo-box').forEach(comboBox => {
      const container = document.createElement('div');
      container.innerHTML = `
        <style>
          vaadin-text-field::part(input-field)::after {
            transition: none;
          }
        </style>
      `;
      comboBox?.shadowRoot?.prepend(container);
    });
  }

  #onSlotSelect(ev) {
    const dropdown = ev.target || ev.path[0];
    this._slot = dropdown.value;
  }

  #prependElement(selector) {
    const container = document.createElement('div');
    container.innerHTML = getElementHtml(this.dashboard.getConnector(), selector);
    return [...container.children].map(child => {
      if (!this._slot) {
        child.removeAttribute('slot');
      } else {
        child.setAttribute('slot', this._slot);
      }
      this.element.prepend(child);
      return child;
    });
  }

  #getElementDescription(selector) {
    return this.dashboard.getConnector().getElementConfig(selector)?.description ?? '';
  }

  #appendElement(selector) {
    const container = document.createElement('div');
    container.innerHTML = getElementHtml(this.dashboard.getConnector(), selector);
    return [...container.children].map(child => {
      if (!this._slot) {
        child.removeAttribute('slot');
      } else {
        child.setAttribute('slot', this._slot);
      }
      this.element.append(child);
      return child;
    });
  }

  #onSearch(ev) {
    const textField = ev.target || ev.path[0];
    this._searchInput = textField.value;
  }

  get #getDragAreaElement() {
    return this.interact.getDragArea().selectionBoxElement;
  }

  get #layout() {
    return this.interact.getDragArea().layout;
  }

  #onDragStart(ev) {
    this.#parentDragPosition = this.element.getBoundingClientRect();
    this.interact.setDragging(true);
    const elem = document.createElement("div");
    ev.dataTransfer.setDragImage(elem, 0, 0);
    this.#onDragOverParent = ev => {
      ev.preventDefault();
      const { clientX, clientY } = ev;
      this.#parentDragPosition = { x: clientX, y: clientY };
    };
    this.#getDragAreaElement.addEventListener('dragover', this.#onDragOverParent);
  }

  #onDragEnd(selector, ev) {
    this.interact.setDragging(false);
    const parentPosition = this.element.getBoundingClientRect();
    const translateX = this.#parentDragPosition.x - parentPosition.x;
    const translateY = this.#parentDragPosition.y - parentPosition.y;

    const elements = this.#prependElement(selector);
    if (this.#layout === 'absolute') {
      elements.forEach(element => {
        element.style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    }
    this.#getDragAreaElement.removeEventListener('dragover', this.#onDragOverParent);
  }

  #getCategories() {
    const expression = /^(?<prefix>[a-z]+)(-[a-z0-9]+)+$/;
    const allowedChildren = this.dashboard
      .getAllowedChildren()
      .find(({ slot }) => this._slot === slot)?.allowedChildren ?? [];
    const categories = new Set();
    allowedChildren.forEach(element => {
      const match = element.match(expression);
      if (match) {
        categories.add(match.groups.prefix);
      } else {
        categories.add('default');
      }
    });
    return [...categories];
  }

  #splitByPrefix(elements) {
    const expression = /^(?<prefix>[a-z]+)(-[a-z0-9]+)+$/;
    const categories = Object.fromEntries(this.#getCategories().map(category => [
      category, [],
    ]));
    elements.forEach(element => {
      const match = element.match(expression);
      const prefix = !match ? 'default' : match.groups.prefix;
      categories[prefix].push(element);
    });
    return Object.entries(categories).map(([category, elements]) => {
      return { category, elements: elements.sort() };
    });
  }

  render() {
    if (!this.element) {
      return html`<p>No element is currently selected.</p>`;
    }

    const elementName = this.dashboard.getElementDisplayName(this.element)

    const webbit = this.dashboard.getConnector()?.getElementWebbit(this.element);

    if (!webbit) {
      return html`<p>There is no configuration for the <span>${elementName}</span> element.</p>`;
    }

    const allowedChildren = this.dashboard.getAllowedChildren().find(({ slot }) => this._slot === slot)?.allowedChildren ?? [];
    const slots = this.dashboard.getAllowedChildren()?.map(({ slot }) => ({ value: slot, label: slot || 'unnamed' })) ?? [];
    return html`
      <p>Add elements to <span>${elementName}</span></p>
      <div class="input-fields">
        <vaadin-text-field class="input-field" label="Search Component" theme="small" @input="${this.#onSearch}"
          .value="${this._searchInput}" ?disabled=${allowedChildren.length===0}>
          <vaadin-icon slot="suffix" icon="vaadin:search" style="cursor: pointer"></vaadin-icon>
        </vaadin-text-field>
        <vaadin-combo-box class="slot-selector input-field" theme="small" label="Slot" .items=${slots}
          ?readonly=${slots.length===1} ?disabled=${slots.length===0} .value="${this._slot}" @change="${this.#onSlotSelect}">
        </vaadin-combo-box>
      </div>
      <div class="component-list">
        ${keyed(this.#symbol, this.renderComponents(
          allowedChildren
          .filter(allowedChild => allowedChild.indexOf(this._searchInput) > -1)
        ))}
      </div>
    `;
  }

  renderComponents(children) {
    const categories = this.#splitByPrefix(children);
    const selectedIndex = Math.max(0, categories.indexOf(this.selectedCategory));
    return html`
      <vaadin-accordion opened=${selectedIndex} @opened-changed=${ev => {
        this.selectedCategory = categories[ev.detail.value];
      }}>
        ${categories.map(({ category, elements }) => html`
          <vaadin-accordion-panel>
            <div slot="summary">${category} (${elements.length})</div>
            ${elements.map(allowedChild => {
              return html`
                <div class="component-item">
                  <div class="info"
                    draggable="true" 
                    @dragstart="${this.#onDragStart}" 
                    @dragend="${ev => this.#onDragEnd(allowedChild, ev)}"
                  >
                    <p><span>${this.dashboard.getSelectorDisplayName(allowedChild)}</span></p>
                    <span class="description">${this.#getElementDescription(allowedChild)}</span>
                  </div>
                  <div class="buttons">
                    <button @click=${() => this.#prependElement(allowedChild)} title="Prepend element">
                      <span class="iconify" data-icon="mdi:table-row-plus-before"></span>
                    </button>
                    <button @click=${() => this.#appendElement(allowedChild)} title="Append element">
                      <span class="iconify" data-icon="mdi:table-row-plus-after"></span>
                    </button>
                  </div>
                </div>
              `;
            })} 
          </vaadin-accordion-panel>
        `)}
      </vaadin-accordion>
    `;
  }
}

customElements.define('dashboard-add-elements', AddElements);