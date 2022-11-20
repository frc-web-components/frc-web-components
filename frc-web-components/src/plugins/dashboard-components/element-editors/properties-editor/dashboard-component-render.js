import { LitElement, css, html } from 'lit';

class DashboardComponentRenderer extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  static properties = {
    dashboard: { type: Object, attribute: false },
    componentType: { type: String, attribute: 'component-type' },
    componentId: { type: String, attribute: 'component-id' },
    config: { type: Object },
  };

  constructor() {
    super();
    this.renderedElement = null;
  }

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
      this.appendChild(this.renderedElement);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.dashboard.unmount(this.renderedElement);
  }

  render() {
    return html` <slot></slot> `;
  }
}

customElements.define(
  'dashboard-component-renderer',
  DashboardComponentRenderer
);
