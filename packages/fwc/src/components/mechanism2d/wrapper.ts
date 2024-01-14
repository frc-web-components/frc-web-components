import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Source } from '@webbitjs/store';
import { Mechanism2dRoot, getMechanism2dRoots } from './mechanism2d';

export const mechanism2dDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Mechanism2d',
  },
  properties: {
    backgroundColor: {
      type: 'String',
      attribute: 'background-color',
      defaultValue: '#000020',
      input: { type: 'ColorPicker' },
    },
    dims: {
      type: 'Array',
      defaultValue: [3, 3],
      input: { type: 'NumberArray' },
    },
    source: { type: 'Source', primary: true, input: { type: 'None' } },
  },
};

export class Mechanism2dWrapper extends LitElement {
  @property({ type: String, attribute: 'background-color' }) backgroundColor =
    '#000020';
  @property({ type: Array }) dims: [number, number] = [3, 3];
  @property({ type: Object }) source: Source | undefined;
  @state() roots: Mechanism2dRoot[] = [];

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 300px;
      height: 300px;
    }

    frc-mechanism2d {
      width: 100%;
      height: 100%;
    }
  `;

  updateMechanism2d(): void {
    this.roots = this.source ? getMechanism2dRoots(this.source) : [];
    requestAnimationFrame(() => {
      this.updateMechanism2d();
    });
  }

  firstUpdated() {
    this.updateMechanism2d();
  }

  render(): TemplateResult {
    return html`
      <frc-mechanism2d
        .roots=${this.roots}
        .backgroundColor=${this.backgroundColor}
        .dims=${this.dims}
      ></frc-mechanism2d>
    `;
  }
}

export default Mechanism2dWrapper;

if (!customElements.get('frc-mechanism2d-wrapper')) {
  customElements.define('frc-mechanism2d-wrapper', Mechanism2dWrapper);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-mechanism2d-wrapper': Mechanism2dWrapper;
  }
}
