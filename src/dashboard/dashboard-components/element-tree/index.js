import { LitElement, html, css } from 'lit';
import './element-tree-node';

const styles = css`
  :host {
    display: block;
    font-family: sans-serif;
    font-size: 16px;
    padding: 5px 10px;
    flex: 1;
  }

  .tree {
    overflow: auto;
    height: 100%;
  }

  p {
    margin-top: 5px;
    font-weight: bold;
    margin-bottom: 8px;
  }
`;

class ElementTree extends LitElement {
  static styles = styles;

  static properties = {
    dashboard: { attribute: false },
  };

  get #connector() {
    return this.dashboard.getConnector();
  }

  firstUpdated() {
    this.#connector.subscribeElementConnected(() => this.requestUpdate());
    this.#connector.subscribeElementDisconnected(() => this.requestUpdate());
    this.dashboard.subscribe('elementSelect', () => this.requestUpdate());
  }

  render() {
    const children = [...this.#connector.getRootElement().children];
    return html`
      <div class="tree">
        ${children.map(
          (element) => html`
            <dashboard-element-tree-node
              .element=${element}
              ?draggable="${children.length > 1}"
              .dashboard=${this.dashboard}
            ></dashboard-element-tree-node>
          `
        )}
      </div>
    `;
  }
}

customElements.define('dashboard-element-tree', ElementTree);
