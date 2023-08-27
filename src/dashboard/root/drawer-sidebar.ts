/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import FrcDashboard from '../frc-dashboard';

interface DashboardElement {
  selector: string;
  name: string;
}

@customElement('dashboard-drawer-sidebar')
export default class DashboardDrawerSidebar extends LitElement {
  @property({ type: Object }) dashboard!: FrcDashboard;
  @state() newElementSelector?: string;
  @state() topLevelComponents: string[] = [];

  static styles = css`
    :host {
      font-family: sans-serif;
      font-size: 15px;
      width: 100%;
      height: 100vh;
      background: #444;
      padding: 20px 15px;
      display: flex;
      flex-direction: column;
      overflow: auto;
      box-sizing: border-box;
      color: white;
    }

    header {
      text-transform: uppercase;
      margin-bottom: 10px;
      font-size: 18px;
      color: lightblue;
    }

    p {
      margin: 0 0 5px;
      cursor: grab;
      line-height: 18px;
    }

    p:hover {
      font-weight: bold;
    }

    p.selected {
      font-weight: bold;
    }
  `;

  #getTopLevelComponents(): string[] {
    const connector = this.dashboard?.getConnector();
    if (!connector) {
      return [];
    }

    const topLevel = connector
      .getElementConfigSelectors()
      .filter(
        (childSelector) =>
          connector.getElementConfig(childSelector)?.dashboard?.topLevel
      );
    return topLevel;
  }

  firstUpdated(): void {
    this.dashboard.subscribe('elementSelect', () => {
      this.topLevelComponents = this.#getTopLevelComponents();
    });
    this.dashboard.subscribe('elementsAdd', () => {
      this.topLevelComponents = this.#getTopLevelComponents();
    });

    this.topLevelComponents = this.#getTopLevelComponents();
  }

  getElements(): DashboardElement[] {
    const { dashboard } = this;
    if (!dashboard) {
      return [];
    }
    const selectors = this.topLevelComponents;
    const elements = selectors
      .filter((selector) => {
        const config = dashboard.getConnector().getElementConfig(selector);
        return !!config;
      })
      .map((selector) => ({
        selector,
        name: dashboard.getSelectorDisplayName(selector),
      }))
      .sort((el1, el2) => el1.name.localeCompare(el2.name));
    return elements;
  }

  render(): TemplateResult {
    return html`
      ${this.getElements().map(
        ({ selector, name }) => html`
          <p
            class="${this.newElementSelector === selector ? 'selected' : ''}"
            key=${selector}
            draggable="true"
            @dragstart=${(event: DragEvent) => {
              const img = document.createElement('img');
              img.src =
                'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
              event.dataTransfer?.setDragImage(img, 0, 0);

              this.dashboard.publish('dragNewElementStart', {
                selector,
                event,
              });
            }}
            @dragend=${(event: Event) =>
              this.dashboard.publish('dragNewElementEnd', { event })}
            @click=${() => {
              this.newElementSelector = selector;
            }}
          >
            ${name}
          </p>
        `
      )}
    `;
  }
}
