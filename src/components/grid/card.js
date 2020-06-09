import { html, css } from '@webbitjs/webbit';
import Container from '../container';

class GridCard extends Container {

  static get metadata() {
    return {
      displayName: 'Grid Card',
      category: 'Layout',
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/gauge/'
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px, rgba(0, 0, 0, 0.05) 0px 1px 4px 0px;
        }
      `
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      gridRows: { type: Number },
      gridCols: { type: Number },
    }
  }

  constructor() {
    super();
    this.margin = '0';
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

webbitRegistry.define('frc-grid-card', GridCard);