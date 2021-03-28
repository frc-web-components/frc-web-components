import { containerStyles } from '../../styles';
import { html, css } from 'lit-element';
import { Webbit, define } from '../../../webbit';

class GridLayout extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Grid Layout',
      category: 'Layout',
      description: 'A container for other components using a grid layout.',
      allowedChildren: ['frc-grid-layout-card'],
      layout: 'none',
      dashboardHtml: `
        <frc-grid-layout rows="2" columns="2">
          <frc-grid-layout-card></frc-grid-layout-card>
          <frc-grid-layout-card></frc-grid-layout-card>
          <frc-grid-layout-card></frc-grid-layout-card>
          <frc-grid-layout-card></frc-grid-layout-card>
        </frc-grid-layout>
      `
      // documentationLink: 'https://frc-web-components.github.io/components/gauge/'
    };
  }

  static get styles() {
    return [
      containerStyles,
      css`
        :host {
          width: 300px;
          height: 300px;
          display: block;
        }

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
      rows: { type: Number, defaultValue: 12 },
      columns: { type: Number, defaultValue: 12 },
      spacing: { type: Number, defaultValue: 8 }
    }
  }

  firstUpdated() {
    this.gridNode = this.shadowRoot.querySelector('[part=grid]');
  }

  updated(changedProps) {
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

define('frc-grid-layout', GridLayout);