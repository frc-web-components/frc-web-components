/* eslint-disable import/extensions */
import { WebbitConnector } from '@webbitjs/webbit';
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import FrcDashboard from '../../frc-dashboard';
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

@customElement('dashboard-element-tree')
export class ElementTree extends LitElement {
  static styles = styles;

  @property({ type: Object, attribute: false }) dashboard!: FrcDashboard;

  get #connector(): WebbitConnector {
    return this.dashboard.getConnector();
  }

  firstUpdated(): void {
    this.#connector.subscribeElementConnected(() => this.requestUpdate());
    this.#connector.subscribeElementDisconnected(() => this.requestUpdate());
    this.dashboard.subscribe('elementSelect', () => this.requestUpdate());
  }

  render(): TemplateResult {
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
