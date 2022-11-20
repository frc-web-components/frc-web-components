/* eslint-disable import/extensions */
import { html, LitElement, TemplateResult } from 'lit';
import { FrcDashboard as FrcDash } from '../dashboard';
import { customElement } from 'lit/decorators.js';
import addPlugins from '../plugins';

@customElement('frc-dashboard')
export default class FrcDashboard extends LitElement {
  constructor() {
    super();
    const dashboard = new FrcDash(this);
    addPlugins(dashboard);
  }

  // eslint-disable-next-line class-methods-use-this
  render(): TemplateResult {
    return html` <slot></slot> `;
  }
}
