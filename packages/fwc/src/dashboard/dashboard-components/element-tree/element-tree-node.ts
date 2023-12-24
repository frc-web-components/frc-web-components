/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import Iconify from '@iconify/iconify';
import { WebbitConfig, WebbitConnector } from '@webbitjs/webbit';
import FrcDashboard from '../../frc-dashboard';

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

  details > summary {
    list-style: none;
  }

  details > summary::marker,
  details > summary::-webkit-details-marker {
    display: none;
  }

  details:not(.selected) > summary:hover {
    background-color: #e8f0f8;
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

  .attributes {
    display: flex;
    flex-wrap: nowrap;
    gap: 5px;
    overflow: auto;
    scrollbar-width: none;
  }

  .attributes::-webkit-scrollbar {
    display: none;
  }

  .attribute {
    color: gray;
  }

  .attribute-name {
    color: brown;
  }

  .attribute-value {
    color: blue;
    white-space: nowrap;
  }

  .caret {
    width: 20px;
  }
`;

@customElement('dashboard-element-tree-node')
export class ElementTreeNode extends LitElement {
  #unsubscribeFromWebbit: () => void = () => {};
  #elementObserver: MutationObserver | null = null;

  static styles = styles;

  @property({ type: HTMLElement, attribute: false })
  element: HTMLElement | null = null;
  @property({ type: Number }) level = 0;
  @property({ type: Boolean }) draggable = false;
  @property({ type: Boolean }) droppable = false;
  @property({ type: Boolean }) expanded = false;
  @property({ type: Object, attribute: false }) dashboard!: FrcDashboard;

  @state() reorderElement?: HTMLElement;

  get selectedElement(): HTMLElement | null {
    return this.dashboard.getSelectedElement();
  }

  get connector(): WebbitConnector {
    return this.dashboard.getConnector();
  }

  @query('details') detailsElement!: HTMLDetailsElement;
  @query('.header') headerElement?: HTMLElement;

  get elementConfig(): WebbitConfig | null {
    if (!this.element) {
      return null;
    }
    return this.connector?.getMatchingElementConfig(this.element) ?? null;
  }

  #hasChildren(): boolean {
    if (!this.element) {
      return false;
    }
    return this.element.children.length > 0;
  }

  #isSelected(): boolean {
    return this.element === this.selectedElement;
  }

  #removeSubscriptions(): void {
    this.#elementObserver?.disconnect();
    this.#unsubscribeFromWebbit();
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('element') && this.element) {
      this.#removeSubscriptions();
      const webbit = this.connector.getElementWebbit(this.element);
      this.#unsubscribeFromWebbit =
        webbit?.subscribe(() => {
          this.requestUpdate();
        }) ?? (() => {});

      this.#elementObserver = new MutationObserver(() => {
        this.requestUpdate();
      });

      this.#elementObserver.observe(this.element, {
        childList: true,
        subtree: true,
        attributeFilter: ['id', 'slot'],
      });
    }

    Iconify.scan(this.renderRoot as HTMLElement);
  }

  firstUpdated(): void {
    this.connector.subscribeElementConnected(() => this.requestUpdate());
    this.connector.subscribeElementDisconnected(() => this.requestUpdate());
    this.dashboard.subscribe('elementSelect', () => {
      if (
        this.selectedElement &&
        this.element?.contains(this.selectedElement) &&
        this.element !== this.selectedElement
      ) {
        this.detailsElement.open = true;
      }
      this.requestUpdate();
    });
    if (this.expanded) {
      this.detailsElement.open = true;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#removeSubscriptions();
  }

  #dispatchEvent(eventName: string): void {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: {
        element: this.element,
        name: this.connector.getMatchingElementSelector(this.element!),
      },
    });
    this.dispatchEvent(event);
  }

  #onSelect(ev: MouseEvent): void {
    const element: HTMLElement = ev.target || (ev as any).path[0];
    const caret = this.renderRoot.querySelector('.caret');
    if (!caret || !caret.contains(element)) {
      this.dashboard.setSelectedElement(this.element!);
    }
  }

  #onPreviewStart(): void {
    this.dashboard.setPreviewedElement(this.element);
  }

  #onPreviewEnd(): void {
    this.dashboard.setPreviewedElement(null);
  }

  #groupChildren(): {
    name: string;
    elements: HTMLElement[];
  }[] {
    const slots: Record<string, HTMLElement[]> = {
      '': [],
    };

    [...this.element!.children].forEach((child) => {
      const slotName = child.getAttribute('slot') ?? '';
      if (typeof slots[slotName] === 'undefined') {
        slots[slotName] = [];
      }
      slots[slotName].push(child as HTMLElement);
    });

    return Object.entries(slots).map(([slotName, children]) => ({
      name: slotName,
      elements: children,
    }));
  }

  renderAttributes() {
    const attributes = ['id', 'slot'];

    return attributes
      .filter((attribute) => this.element?.hasAttribute(attribute))
      .map(
        (attribute) => html`
          <span class="attribute">
            <span class="attribute-name">${attribute}</span>="<span
              class="attribute-value"
              >${this.element?.getAttribute(attribute)}</span
            >"
          </span>
        `
      );
  }

  #onOpenToggle(): void {
    setTimeout(() => {
      this.detailsElement.open = !this.detailsElement.open;
    });
  }

  #onDragStart(ev: DragEvent): void {
    const elem = document.createElement('div');
    ev.dataTransfer?.setDragImage(elem, 0, 0);
    this.#dispatchEvent('reorderStart');
  }

  #onDragEnd(): void {
    this.#dispatchEvent('reorderEnd');
  }

  #onDragenter(ev: DragEvent): void {
    if (this.droppable) {
      ev.preventDefault();
    }
  }

  #onDragover(ev: DragEvent): void {
    if (this.droppable) {
      ev.preventDefault();
    }
  }

  #onReorderStart(ev: CustomEvent): void {
    ev.stopPropagation();
    this.reorderElement = ev.detail.element;
  }

  #onReorderEnd(ev: CustomEvent): void {
    ev.stopPropagation();
    this.reorderElement = undefined;
  }

  render(): TemplateResult {
    const elementName = this.element
      ? this.dashboard.getElementDisplayName(this.element)
      : '';

    return html`
      <details
        @click=${(ev: MouseEvent) => ev.preventDefault()}
        style=${`--level: ${this.level}`}
        class=${classMap({
          childless: !this.#hasChildren(),
          selected: this.#isSelected(),
        })}
        @keyup=${(ev: KeyboardEvent) => {
          if (this.element?.tagName === 'DASHBOARD-TAB') {
            return;
          }
          const isDelete = ev.key === 'Delete' || ev.key === 'Backspace';
          if (this.#isSelected() && isDelete) {
            this.element?.remove();
          }
        }}
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
            <div style="overflow: hidden">
              <span class="element-name">
                ${this.#hasChildren()
                  ? html`
                      <span class="caret" @click=${this.#onOpenToggle}>
                        <vaadin-icon
                          icon="vaadin:angle-right"
                          class="closed-cursor"
                        ></vaadin-icon>
                        <vaadin-icon
                          icon="vaadin:angle-down"
                          class="opened-cursor"
                        ></vaadin-icon>
                      </span>
                    `
                  : ''}
                <label>${elementName}</label>
              </span>
              <span class="attributes"> ${this.renderAttributes()} </span>
            </div>
            ${this.draggable
              ? html`
                  <div
                    class="reorder-icon"
                    draggable="true"
                    @dragstart="${this.#onDragStart}"
                    @dragend="${this.#onDragEnd}"
                  >
                    <span
                      class="iconify"
                      data-icon="mdi:reorder-horizontal"
                    ></span>
                  </div>
                `
              : ''}
          </div>
        </summary>
        ${this.#hasChildren()
          ? html`
              <div class="nodes">
                ${this.#groupChildren().map(
                  ({ elements: children }) => html`
                    ${children.map(
                      (child) => html`
                        <dashboard-element-tree-node
                          .element="${child}"
                          .dashboard=${this.dashboard}
                          level="${this.level + 1}"
                          ?draggable="${children.length > 1}"
                          ?droppable="${this.reorderElement}"
                          @reorderStart="${this.#onReorderStart}"
                          @reorderEnd="${this.#onReorderEnd}"
                          @drop=${(ev: DragEvent) => {
                            const position = ev.offsetY / 25;
                            if (
                              this.reorderElement &&
                              child !== this.reorderElement
                            ) {
                              if (position < 0.5) {
                                child.before(this.reorderElement);
                              } else {
                                child.after(this.reorderElement);
                              }
                            }
                          }}
                        ></dashboard-element-tree-node>
                      `
                    )}
                  `
                )}
              </div>
            `
          : ''}
      </details>
    `;
  }
}
