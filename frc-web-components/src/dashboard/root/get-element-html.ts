import { WebbitConnector } from '@webbitjs/webbit';

export default function getElementHtml(
  connector: WebbitConnector,
  selector: string
): string {
  // TODO: demos isn't a properly of WebbitConfig
  const config: any = connector.getElementConfig(selector);
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
  return [...container.children].map((child) => {
    // if (!this._slot) {
    //   child.removeAttribute('slot');
    // } else {
    //   child.setAttribute('slot', this._slot);
    // }
    parent.append(child);
    return child as HTMLElement;
  });
}
