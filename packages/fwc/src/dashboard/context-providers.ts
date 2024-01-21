import { createContext } from '@lit/context';
import FrcDashboard from './frc-dashboard';
import { customElement, property, state } from 'lit/decorators.js';
import { LitElement, TemplateResult, css, html } from 'lit';
import { provide } from '@lit/context';

export const dashboardContext = createContext<FrcDashboard>(
  Symbol('fwcDashboard')
);
export const selectedElementContext = createContext<HTMLElement | undefined>(
  Symbol('selectedElement')
);

@customElement('dashbord-state-providers')
export class StateProviders extends LitElement {
  @provide({ context: dashboardContext })
  @property({ type: Object, attribute: false })
  dashboard!: FrcDashboard;
  @provide({ context: selectedElementContext }) selectedElement?: HTMLElement;

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
  `;

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
