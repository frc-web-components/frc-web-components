import { containerStyles } from '../../styles';
import { html, css } from 'lit-element';
import { Webbit, define } from '../../../webbit';

class GridLayoutCard extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Grid Card',
      category: 'Layout',
      description: 'A single element in a grid layout. Used to container other components in a grid layout.',
      // documentationLink: 'https://frc-web-components.github.io/components/gauge/',
      allowedParents: ['frc-grid-layout'],
      layout: 'resizable',
    };
  }

  static get styles() {
    return [
        containerStyles,
      css`
        :host {
          margin: 0;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px, rgba(0, 0, 0, 0.05) 0px 1px 4px 0px;
        }
      `
    ];
  }

  static get properties() {
    return {
      gridRows: { type: Number, defaultValue: 1 },
      gridCols: { type: Number, defaultValue: 1 },
    }
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

define('frc-grid-layout-card', GridLayoutCard);