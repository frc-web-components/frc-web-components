/* eslint-disable import/extensions */
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FrcDashboard as FrcDash } from './dashboard';
import addPlugins from './plugins';
import addElements from './elements';
import addProviders from './source-providers';
import addTutorials from './tutorials';
import addThemes from './themes';

@customElement('frc-dashboard')
export default class FrcDashboard extends LitElement {
  constructor() {
    super();
    const dashboard = new FrcDash(this);
    addPlugins(dashboard);
    addElements(dashboard);
    addProviders(dashboard);
    addTutorials(dashboard);
    addThemes(dashboard);
  }

  // eslint-disable-next-line class-methods-use-this
  render(): TemplateResult {
    return html` <slot></slot> `;
  }
}
