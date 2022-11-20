import { WebbitConnector } from '@webbitjs/webbit';

export default function removeElement(
  element: HTMLElement,
  connector: WebbitConnector
): HTMLElement | null {
  const parent = element.parentElement;
  const siblings = [...(parent?.children ?? [])];
  const elementIndex = siblings.indexOf(element);
  const nextElement =
    siblings[elementIndex + 1] ?? siblings[elementIndex - 1] ?? parent;
  element?.remove();
  const isInDashboard =
    connector.getRootElement().contains(nextElement) &&
    nextElement !== connector.getRootElement();
  return isInDashboard ? (nextElement as HTMLElement) : null;
}
