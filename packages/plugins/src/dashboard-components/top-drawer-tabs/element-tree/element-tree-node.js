import { LitElement, html, css } from 'lit';
import Iconify from '@iconify/iconify';

function classMap(classes) {
  const filteredClasses = Object.entries(classes)
    .filter(([, filter]) => filter)
    .map(([className]) => className);
  return filteredClasses.join(' ');
}

const styles = css`
  :host {
    display: block;
    font-family: sans-serif;
    font-size: 16px;
  }

  summary {
    display: flex;
  }

  summary div {
    height: 25px;
    display: inline-flex;
    align-items: center;
    cursor: default;
  }

  details .opened-cursor {
    display: none;
    width: 15px;
    margin-right: 3px;
  }

  details .closed-cursor {
    display: inline-block;
    width: 15px;
    margin-right: 3px;
  }

  details[open] > summary .opened-cursor {
    display: inline-block;
  }

  details[open] > summary .closed-cursor {
    display: none;
  }

  .childless > summary {
    list-style: none;
  }

  details:not(.selected) > summary:hover {
    background-color: #E8F0F8;
  }

  details.selected > summary {
    background-color: #ddd;
  }

  .header {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
  }

  .header .element-name {
    display: flex;
    white-space: nowrap;
    align-items: center;
    height: 100%;
    padding-left: calc(5px + 20px * var(--level));
    box-sizing: border-box;
    margin-right: 8px;
  }

  .header label {
    color: purple;
  }

  .header .reorder-icon {
    margin-right: 10px;
    cursor: grab;
  }

  .attribute {
    color: gray;
  }

  .attribute-name {
    color: brown;
  }

  .attribute-value {
    color: blue;
  }

  .caret {
    width: 20px;
  }
`;

class ElementTreeNode extends LitElement {

  #unsubscribeFromWebbit;
  #elementObserver;

  static styles = styles;

  static get properties() {
    return {
      element: { type: HTMLElement, attribute: false },
      level: { type: Number },
      draggable: { type: Boolean },
      droppable: { type: Boolean },
      isReordering: { state: true },
      dashboard: { attribute: false },
    };
  }

  constructor() {
    super();
    this.element = null;
    this.level = 0;
    this.#unsubscribeFromWebbit = () => {};
    this.#elementObserver = null;
    this.draggable = false;
    this.droppable = false;
    this.isReordering = false;
  }

  get selectedElement() {
    return this.dashboard.getSelectedElement();
  }

  get connector() {
    return this.dashboard.getConnector();
  }

  get headerElement() {
    return this.renderRoot.querySelector('.header');
  }

  get detailsElement() {
    return this.renderRoot.querySelector('details');
  }

  get elementConfig() {
    return this.connector?.getMatchingElementConfig(this.element) ?? null;
  }

  #hasChildren() {
    return this.element.children.length > 0;
  }

  #isSelected() {
    return this.element === this.selectedElement;
  }

  #removeSubscriptions() {
    this.#elementObserver?.disconnect();
    this.#unsubscribeFromWebbit();
  }

  updated(changedProps) {
    if (changedProps.has('element')) {
      this.#removeSubscriptions();
      const webbit = this.connector.getElementWebbit(this.element);
      this.#unsubscribeFromWebbit = webbit?.subscribe(() => {
        this.requestUpdate();
      }) ?? (() => {});
  
      this.#elementObserver = new MutationObserver(() => {
        this.requestUpdate();
      });
  
      this.#elementObserver.observe(this.element, {
        childList: true,
        subtree: true,
        attributeFilter: ['id', 'slot']
      });
    }

    Iconify.scan(this.renderRoot);
  }

  firstUpdated() {
    this.connector.subscribeElementConnected(() => this.requestUpdate());
    this.connector.subscribeElementDisconnected(() => this.requestUpdate());
    this.dashboard.subscribe('elementSelect', () => {
      if (this.selectedElement && this.element.contains(this.selectedElement) && this.element !== this.selectedElement) {
        this.detailsElement.open = true;
      }
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#removeSubscriptions();
  }

  #dispatchEvent(eventName) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: {
        element: this.element,
        name: this.connector.getMatchingElementSelector(this.element),
      }
    });
    this.dispatchEvent(event);
  }

  #onSelect(ev) {
    const element = ev.target || ev.path[0];
    const caret = this.renderRoot.querySelector('.caret');
    if (!caret || !caret.contains(element)) {
      this.dashboard.setSelectedElement(this.element);
    }
  }

  #onPreviewStart() {
    this.dashboard.setPreviewedElement(this.element);
  }

  #onPreviewEnd() {
    this.dashboard.setPreviewedElement(null);
  }
  
  #groupChildren() {
    const slots = {
      '': []
    };

    [...this.element.children].forEach(child => {
      const slotName = child.getAttribute('slot') ?? '';
      if (typeof slots[slotName] === 'undefined') {
        slots[slotName] = [];
      }
      slots[slotName].push(child);
    });

    return Object.entries(slots).map(([slotName, children]) => {
      return { name: slotName, elements: children };
    });
  }

  renderAttributes() {

    const attributes = ['id', 'slot'];

    return attributes
      .filter(attribute => {
        return this.element.hasAttribute(attribute);
      })
      .map(attribute => html`
        <span class="attribute">
          <span class="attribute-name">${attribute}</span>="<span class="attribute-value">${this.element.getAttribute(attribute)}</span>"
        </span>
      `);

  }

  _onOpenToggle() {
    setTimeout(() => {
      this.detailsElement.open = !this.detailsElement.open;
    })
  }

  #onDragStart(ev) {
    const elem = document.createElement("div");
    ev.dataTransfer.setDragImage(elem, 0, 0);
    this.#dispatchEvent('reorderStart');
  }

  #onDragEnd() {
    this.#dispatchEvent('reorderEnd');
  }

  #onDragleave(ev) {
    if (this.droppable) {
      ev.preventDefault();
    }
  }

  #onDragenter(ev) {
    if (this.droppable) {
      ev.preventDefault();
    }
  }

  #onDragover(ev) {
    if (this.droppable) {
      ev.preventDefault();
    }
  }

  #onReorderStart(ev) {
    ev.stopPropagation();
    this.isReordering = true;
  }

  #onReorderEnd(ev) {
    ev.stopPropagation();
    this.isReordering = false;
  }

  render() {

    const elementName = this.dashboard.getElementDisplayName(this.element);

    return html`
      <details 
        @click=${ev => ev.preventDefault()}
        style=${`--level: ${this.level}`}
        class=${classMap({
          childless: !this.#hasChildren(),
          selected: this.#isSelected(),
        })}
      >
        <summary>
          <div 
            class="header" 
            @mouseenter="${this.#onPreviewStart}" 
            @mouseleave="${this.#onPreviewEnd}"
            @click="${this.#onSelect}"
            @dragover="${this.#onDragover}"
            @dragenter="${this.#onDragenter}"
          >
            <div>
              <span class="element-name">
                ${this.#hasChildren() ? html`
                  <span class="caret" @click=${this._onOpenToggle}>
                    <vaadin-icon icon="vaadin:angle-right" class="closed-cursor"></vaadin-icon>
                    <vaadin-icon icon="vaadin:angle-down" class="opened-cursor"></vaadin-icon>
                  </span>
                `: ''}
                <label>${elementName}</label>
              </span>
              <span class="attributes">
                ${this.renderAttributes()}
              </span>
            </div>
            ${this.draggable ? html` 
              <div 
                class="reorder-icon" 
                draggable="true"
                @dragstart="${this.#onDragStart}"
                @dragend="${this.#onDragEnd}"
              >
                <span class="iconify" data-icon="mdi:reorder-horizontal"></span>
              </div>
            ` : ''}
          </div>
        </summary>
        ${this.#hasChildren() ? html`
          <div class="nodes">
            ${this.#groupChildren().map(({ name, elements: children }) => html`
              ${children.map(child => html`
                <dashboard-element-tree-node
                  .element="${child}"
                  .dashboard=${this.dashboard}
                  level="${this.level + 1}"
                  ?draggable="${children.length > 1}"
                  ?droppable="${this.isReordering}"
                  @reorderStart="${this.#onReorderStart}"
                  @reorderEnd="${this.#onReorderEnd}"
                ></dashboard-element-tree-node>
              `)}
            `)}
          </div>
        ` : ''}
      </details>
    `;
  }

}

customElements.define('dashboard-element-tree-node', ElementTreeNode);