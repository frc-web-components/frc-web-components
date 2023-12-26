import { FrcDashboard } from '@frc-web-components/fwc';
// @ts-expect-error - no types
import { SourceProvider, WebbitConfig } from '@webbit/store';
// @ts-expect-error - no types
import { WebbitConfig } from '@webbitjs/webbit';

const dashboard = new FrcDashboard();
const dashboardElement = document.createElement('dashboard-root');
(dashboardElement as any).dashboard = dashboard;


export function mountDashboard(element: HTMLElement) {
  element.appendChild(dashboardElement);
}

export function addThemeRules(theme: string, cssVariables: Record<string, string>) {
  dashboard.addThemeRules(theme, cssVariables);
}

export function addSourceProvider(providerName: string, sourceProvider: SourceProvider) {
  dashboard.addSourceProvider(providerName, sourceProvider);
}

export function setDefaultSourceProvider(providerName: string) {
  dashboard.setDefaultSourceProvider(providerName);
}

export function addElements(elementConfigs?: Record<string, WebbitConfig> | undefined, group?: string | undefined) {
  dashboard.addElements(elementConfigs, group);
}

export function getDashboard() {
  return dashboard;
}
