/* eslint-disable class-methods-use-this */
import { LitElement, css, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators';
import FrcDashboard from './frc-dashboard';

@customElement('dashboard-component-renderer')
export default class DashboardComponentRenderer extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  @property({ attribute: false })
  public dashboard?: FrcDashboard;

  @property({ attribute: 'component-type' })
  componentType?: string;

  @property({ attribute: 'component-id' })
  componentId?: string;

  @property()
  config?: Record<string, unknown>;

  private renderedElement?: HTMLElement;

  updated(): void {
    if (
      this.componentId &&
      this.componentType &&
      this.config &&
      this.dashboard
    ) {
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

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.renderedElement) {
      this.dashboard?.unmount(this.renderedElement);
    }
  }

  render(): TemplateResult {
    return html` <slot></slot> `;
  }
}
