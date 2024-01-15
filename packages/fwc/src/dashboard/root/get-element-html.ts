import { WebbitConnector } from '@webbitjs/webbit';

export default function getElementHtml(
  connector: WebbitConnector,
  selector: string
): string {
  // TODO: demos isn't a property of WebbitConfig
  const config: any = connector.getElementConfig(selector);
  const defaultHtml = config?.dashboard?.defaultHtml;
  if (defaultHtml) {
    return config.dashboard.defaultHtml;
  }
  if (config?.demos) {
    const [{ html }] = config.demos;
    return html;
  }
  return `<${selector}></${selector}>`;
}

export function appendElementToDashboard(
  connector: WebbitConnector,
  selector: string,
  parent: HTMLElement
): HTMLElement[] {
  const container = document.createElement('div');
  container.innerHTML = getElementHtml(connector, selector);
  const config = connector.getElementConfig(selector);
  const onInit = config?.dashboard?.onInit;
  return [...container.children].map((child) => {
    if (child.matches(selector)) {
      if (typeof onInit === 'function') {
        onInit(child as HTMLElement);
      }
    }
    parent.append(child);
    return child as HTMLElement;
  });
}
