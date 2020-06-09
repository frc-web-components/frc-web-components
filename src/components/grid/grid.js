import { html, css } from '@webbitjs/webbit';
import Container from '../container';

class Grid extends Container {

  static get metadata() {
    return {
      displayName: 'Grid',
      category: 'Layout',
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/gauge/'
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        kor-grid {
          width: 100%;
          height: 100%;
          gap: var(--grid-gap);
        }
      `
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      rows: { type: Number },
      columns: { type: Number },
      spacing: { type: Number }
    }
  }

  constructor() {
    super();
    this.display = 'block';
    this.width = '100%';
    this.height = '100%';
    this.rows = 12;
    this.columns = 12;
    this.spacing = 8;
  }

  firstUpdated() {
    this.gridNode = this.shadowRoot.querySelector('[part=grid]');
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('spacing')) {
      this.gridNode.style.setProperty('--grid-gap', `${this.spacing}px`);
    }
  }

  render() {
    return html`
      <kor-grid part="grid" rows="${this.rows}" columns="${this.columns}">
        <slot></slot>
      </kor-grid>
    `;
  }
}

webbitRegistry.define('frc-grid', Grid);