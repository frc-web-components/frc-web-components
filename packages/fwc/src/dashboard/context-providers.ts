import { createContext } from '@lit/context';
import FrcDashboard from './frc-dashboard';
import { customElement, property, state } from 'lit/decorators.js';
import { LitElement, PropertyValueMap, TemplateResult, css, html } from 'lit';
import { provide } from '@lit/context';

export const dashboardContext = createContext<FrcDashboard>(
  Symbol('fwcDashboard')
);

export const selectedElementContext = createContext<HTMLElement | undefined>(
  Symbol('selectedElement')
);

export const selectElmentChildrenContext = createContext<HTMLElement[]>(
  Symbol('selectedElementChildren')
);

@customElement('dashbord-state-providers')
export class StateProviders extends LitElement {
  @provide({ context: dashboardContext })
  @property({ type: Object, attribute: false })
  dashboard!: FrcDashboard;
  @provide({ context: selectedElementContext })
  @state()
  selectedElement?: HTMLElement;
  @provide({ context: selectElmentChildrenContext })
  selectedElementChildren: HTMLElement[] = [];

  #selectedElementObserver?: MutationObserver;

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
  `;

  #updateSelectedElementChildren() {
    if (!this.selectedElement) {
      this.selectedElementChildren = [];
      return;
    }

    this.selectedElementChildren = !this.selectedElement
      ? []
      : ([...this.selectedElement.children].filter((child) => {
          const config = this.dashboard
            .getConnector()
            .getMatchingElementConfig(child as HTMLElement);
          return !!config;
        }) as HTMLElement[]);
  }

  #updatedSelectedElementObserver() {
    this.#selectedElementObserver?.disconnect();

    if (this.selectedElement) {
      this.#selectedElementObserver = new MutationObserver(() => {
        this.#updateSelectedElementChildren();
      });
      this.#selectedElementObserver.observe(this.selectedElement, {
        childList: true,
        subtree: true,
        attributeFilter: ['id', 'slot'],
      });
    }
  }

  protected updated(
    changedProps: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProps.has('selectedElement')) {
      this.#updateSelectedElementChildren();
      this.#updatedSelectedElementObserver();
    }
  }

  protected firstUpdated(): void {
    this.dashboard.subscribe('elementSelect', () => {
      this.selectedElement = this.dashboard.getSelectedElement() ?? undefined;
    });
    this.selectedElement = this.dashboard.getSelectedElement() ?? undefined;
  }

  render(): TemplateResult {
    if (!this.dashboard) {
      return html``;
    }
    return html` <slot></slot> `;
  }
}
