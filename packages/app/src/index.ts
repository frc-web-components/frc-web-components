import { FrcDashboard } from '@frc-web-components/fwc';
import { SourceProvider } from '@webbitjs/store';
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

export function addElements(elementConfigs?: Record<string, Partial<WebbitConfig>> | undefined, group?: string | undefined) {
  dashboard.addElements(elementConfigs, group);
}

export function getDashboard() {
  return dashboard;
}

let assetBasePath = '';

export function setAssetBasePath(path: string) {
  assetBasePath = path;
}

export function getAssetUrl(relativePath: string): string {
  return `${assetBasePath.replace(/\/$/, "")}/${relativePath.replace(/^\//, "")}`;
}