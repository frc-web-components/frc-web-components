import { html, svg, css, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

export default class ScoringGridNode extends LitElement {
  @property({ type: Number, attribute: 'node-id' }) nodeId = 1;
  @property({ type: Boolean }) selected = false;
  @property({ type: Number }) cones = 0;
  @property({ type: Number }) cubes = 0;

  @state() background = '';

  static styles = css`
    :host {
      display: block;
      color: black;
      font-size: 2em;
      height: 100%;
      flex-grow: 1;
      border: 1px solid black;
      box-sizing: border-box;
    }
  `;

  #updateBackground(): void {
    if (this.selected) {
      this.background = 'green';
    } else if (this.nodeId >= 1 && this.nodeId <= 9) {
      this.background = 'lightgray';
    } else if ((this.nodeId - 1) % 3 === 1) {
      this.background = 'purple';
    } else {
      this.background = 'yellow';
    }
    this.style.setProperty('background-color', this.background);
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('selected') || changedProps.has('nodeId')) {
      this.#updateBackground();
    }
  }

  render(): TemplateResult {
    return html`
      <div style="text-align: center; margin-block:auto;">${this.nodeId}</div>

      <!-- empty on:click binding above passes click events to be bound on the Node component -->
      ${svg`
        <svg
          viewBox="-2 -2 28 28"
          style="margin-right: 8px; width:100%; height:100%; pointer-events:none"
        >
          ${when(
            this.cubes > 1,
            () => svg`
              <polygon
                points="8,8 8,20 20,20, 20,8"
                style="fill:rgb(150,0,255);stroke-width:1;stroke:rgb(0,0,0)"
              />
              <polygon
                points="4,4 4,16 16,16, 16,4"
                style="fill:rgb(150,0,255);stroke-width:1;stroke:rgb(0,0,0)"
              />
            `,
          )}
          ${when(
            this.cubes === 1,
            () => svg`
              <polygon
                points="6,6 6,18 18,18, 18,6"
                style="fill:rgb(150,0,255);stroke-width:1;stroke:rgb(0,0,0)"
              />
            `,
          )}
          ${when(
            this.cones > 1,
            () => svg`
              <polygon
                points="13,8 11,8 8,22 5,22 19,22 16,22"
                style="fill:rgb(255,200,0);stroke-width:1;stroke:rgb(0,0,0)"
              />
              <polygon
                points="13,4 11,4 8,18 5,18 19,18 16,18"
                style="fill:rgb(255,200,0);stroke-width:1;stroke:rgb(0,0,0)"
              />
            `,
          )}
          
          ${when(
            this.cones === 1,
            () => svg`
              <polygon
                points="13,6 11,6 8,20 5,20 19,20 16,20"
                style="fill:rgb(255,200,0);stroke-width:1;stroke:rgb(0,0,0)"
              />
            `,
          )}  
        </svg>
      `}
    `;
  }
}

if (!customElements.get('frc-scoring-grid-node')) {
  customElements.define('frc-scoring-grid-node', ScoringGridNode);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-scoring-grid-node': ScoringGridNode;
  }
}
