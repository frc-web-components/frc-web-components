import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import FrcDashboard from '../../../frc-dashboard';

@customElement('dashboard-component-renderer')
export class DashboardComponentRenderer extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  @property({ type: Object, attribute: false }) dashboard!: FrcDashboard;
  @property({ type: String, attribute: 'component-type' }) componentType = '';
  @property({ type: String, attribute: 'component-id' }) componentId = '';
  @property({ type: Object }) config!: Record<string, unknown>;

  renderedElement?: HTMLElement;

  static properties = {
    dashboard: { type: Object, attribute: false },
    componentType: { type: String, attribute: 'component-type' },
    componentId: { type: String, attribute: 'component-id' },
    config: { type: Object },
  };

  updated() {
    if (
      this.componentId &&
      this.componentType &&
      this.config &&
      this.dashboard
    ) {
      this.renderedElement?.remove();
      this.renderedElement = this.dashboard.create(
        this.componentType,
        this.componentId,
        this.config
      );
      if (this.renderedElement) {
        this.appendChild(this.renderedElement);
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.renderedElement) {
      this.dashboard.unmount(this.renderedElement);
    }
  }

  render() {
    return html` <slot></slot> `;
  }
}
