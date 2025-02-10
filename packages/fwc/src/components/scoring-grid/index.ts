import { html, css, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import './node';
import { WebbitConfig } from '@webbitjs/webbit';

export const scoringGridDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Scoring Grid',
  },
  properties: {
    cubesScored: {
      type: 'Array',
      attribute: 'cubes-scored',
      input: { type: 'NumberArray' },
    },
    conesScored: {
      type: 'Array',
      attribute: 'cones-scored',
      input: { type: 'NumberArray' },
    },

    hideLinks: { type: 'Boolean', attribute: 'hide-links' },
    reverseRow: { type: 'Boolean', attribute: 'reverse-row' },
    reverseCol: { type: 'Boolean', attribute: 'reverse-col' },
  },
};

function getColumnFromId(id: number, reverseCol = false) {
  if (!reverseCol) {
    return 1 + ((id - 1) % 9);
  }
  return 9 - ((id - 1) % 9);
}

function getRowFromId(id: number, reverseRow = false) {
  if (!reverseRow) {
    return Math.floor((id - 1) / 9) + 1;
  }
  return 3 - Math.floor((id - 1) / 9);
}

function getRange(start: number, end: number) {
  return Array.from(Array(end + 1).keys()).slice(start);
}

export class ScoringGrid extends LitElement {
  @property({ type: Number }) selection = 0;
  @property({ type: Array, attribute: 'cubes-scored' }) cubesScored: number[] =
    [];
  @property({ type: Array, attribute: 'cones-scored' }) conesScored: number[] =
    [];
  @property({ type: Boolean, attribute: 'hide-links' }) hideLinks = false;
  @property({ type: Boolean, attribute: 'reverse-row' }) reverseRow = false;
  @property({ type: Boolean, attribute: 'reverse-col' }) reverseCol = false;

  @state() leftOfLinks: number[] = [];

  static styles = css`
    :host {
      display: inline-block;
      width: 550px;
      height: 380px;
    }

    .grid {
      display:grid;
      grid-template-columns: repeat(9, calc(100% / 9));
      grid-template-rows: repeat(3, calc(100% / 3));
      height:100%;
      width:100%;
      flex-direction:row-reverse;
      grid-auto-flow: dense;"
    }

    .link {
      border: 5px solid black;
      border-radius: 10px;
      margin: 5px;
      box-sizing: border-box;
      pointer-events: none;
    }
  `;

  #onSelect(nodeId: number): void {
    if (this.selection === nodeId) {
      this.selection = 0;
    } else {
      this.selection = nodeId;
    }
    const event = new CustomEvent('select', {
      bubbles: true,
      composed: true,
      detail: { nodeId: this.selection },
    });

    this.dispatchEvent(event);
  }

  #updateLinks(): void {
    const leftOfLinks = [];
    const scored = this.cubesScored.concat(this.conesScored);
    for (let row = 0; row < 3; row += 1) {
      for (let column = 1; column <= 7; column += 1) {
        if (
          scored.includes(row * 9 + column) &&
          scored.includes(row * 9 + column + 1) &&
          scored.includes(row * 9 + column + 2)
        ) {
          leftOfLinks.push(row * 9 + column);
          column += 2;
        }
      }
    }
    this.leftOfLinks = leftOfLinks;
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('cubesScored') || changedProps.has('conesScored')) {
      this.#updateLinks();
    }
  }

  renderLinks(): TemplateResult {
    if (this.hideLinks) {
      return html``;
    }
    return html`
      ${this.leftOfLinks.map(
        (id) => html`
          <div
            class="link"
            style=${styleMap({
              gridColumn: `${Math.min(
                getColumnFromId(id, this.reverseCol),
                getColumnFromId(id + 2, this.reverseCol),
              )} / span 3`,
              gridRow: getRowFromId(id, this.reverseRow),
            })}
          ></div>
        `,
      )}
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="grid">
        ${getRange(1, 27).map(
          (id) => html`
            <div
              style=${styleMap({
                gridColumn: getColumnFromId(id, this.reverseCol),
                gridRow: getRowFromId(id, this.reverseRow),
              })}
            >
              <frc-scoring-grid-node
                node-id=${id}
                ?selected=${this.selection === id}
                @click=${() => {
                  this.#onSelect(id);
                }}
                cubes=${this.cubesScored.filter((x) => x === id).length}
                cones=${this.conesScored.filter((x) => x === id).length}
              >
              </frc-scoring-grid-node>
            </div>
          `,
        )}
        ${this.renderLinks()}
      </div>
    `;
  }
}

export default ScoringGrid;

if (!customElements.get('frc-scoring-grid')) {
  customElements.define('frc-scoring-grid', ScoringGrid);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-scoring-grid': ScoringGrid;
  }
}
