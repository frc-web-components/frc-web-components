import { WebbitConnector } from '@webbitjs/webbit';

export default function getAllowedChildren(element: HTMLElement, connector: WebbitConnector):
  { slot: string, allowedChildren: string[] }[] {
  if (!element) {
    return [];
  }
  const config = connector.getMatchingElementConfig(element);
  if (!config) {
    return [];
  }
  return config.slots.map(({ name, allowedChildren }) => {
    const children = connector
      .getElementConfigSelectors()
      .filter(childSelector => (allowedChildren instanceof Array
        ? allowedChildren.includes(childSelector)
        : connector.getElementConfig(childSelector)?.dashboard?.topLevel));
    return {
      slot: name,
      allowedChildren: children,
    };
  });
}
