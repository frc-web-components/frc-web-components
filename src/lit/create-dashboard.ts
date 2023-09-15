import WebbitStore from '@webbitjs/store';
import { render, html, TemplateResult } from 'lit';
import NT4Provider from '../source-providers/nt4/nt4-provider';
import { ntValueDirective } from './directives';

interface RenderOptions {
  html: typeof html;
  nt: ReturnType<typeof ntValueDirective>;
  store: WebbitStore;
}

interface DashboardOptions {
  address: string;
  rootElement: string | HTMLElement;
  render: (renderOptions: RenderOptions) => TemplateResult;
}

export default function createDashboard(dashboardOptions: DashboardOptions) {
  const store = new WebbitStore();
  const nt4Provider = new NT4Provider();
  store.addSourceProvider('NetworkTables', nt4Provider);
  store.setDefaultSourceProvider('NetworkTables');
  nt4Provider.connect(dashboardOptions.address);
  const nt = ntValueDirective(store);

  const template = dashboardOptions.render({ nt, html, store });
  const element =
    typeof dashboardOptions.rootElement === 'string'
      ? document.querySelector(dashboardOptions.rootElement)
      : dashboardOptions.rootElement;
  if (element) {
    render(template, element as HTMLElement);
  }
}
