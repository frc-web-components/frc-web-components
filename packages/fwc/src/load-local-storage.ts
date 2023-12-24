import { FrcDashboard } from './dashboard';

export function getStoredHtml(): string | undefined {
  const storedHtml = localStorage.getItem('storedHtml');
  return storedHtml ?? undefined;
}

export function setStoredHtml(html: string): void {
  localStorage.setItem('storedHtml', html);
}

export default function loadLocalStorage(dashboard: FrcDashboard): void {
  const connector = dashboard.getConnector();

  const updateHtml = () => {
    const html = dashboard.getHtml();
    setStoredHtml(html);
  };

  setTimeout(() => {
    const storedHtml = getStoredHtml();

    if (storedHtml) {
      dashboard.setHtml(storedHtml);
    }

    connector.subscribeElementConnected(updateHtml);
    connector.subscribeElementDisconnected(updateHtml);
    dashboard.subscribe('propertyChange', updateHtml);
    dashboard.subscribe('sourceChange', updateHtml);
    dashboard.subscribe('elementResizeEnd', updateHtml);
    dashboard.subscribe('elementDragEnd', updateHtml);
  });
}
