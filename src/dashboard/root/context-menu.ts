/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import './settings-dialog';
import FrcDashboard from '../frc-dashboard';

@customElement('dashboard-context-menu')
export class DashboardNavbar extends LitElement {
  @property({ type: Object }) dashboard!: FrcDashboard;
  @query('vaadin-context-menu') _contextMenu!: HTMLElement;

  static styles = css``;

  firstUpdated() {
    window.addEventListener('contextmenu', (e) => {
      (this._contextMenu as any).open(e);
      e.preventDefault();
    });
  }

  render(): TemplateResult {
    return html`
      <vaadin-context-menu
        .items=${[{ text: 'View' }, { text: 'Edit' }, { text: 'Delete' }]}
      ></vaadin-context-menu>
    `;
  }
}
