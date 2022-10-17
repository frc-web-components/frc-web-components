import { WebbitConfig, WebbitConnector } from '@webbitjs/webbit';

export function getAllowedChildrenByConfig(
  config: WebbitConfig,
  connector: WebbitConnector
): { slot: string; allowedChildren: string[] }[] {
  return config.slots.map(({ name, allowedChildren }) => {
    const children: string[] = connector
      .getElementConfigSelectors()
      .filter((childSelector) =>
        allowedChildren instanceof Array
          ? allowedChildren.includes(childSelector)
          : connector.getElementConfig(childSelector)?.dashboard?.topLevel
      );
    return {
      slot: name,
      allowedChildren: children,
    };
  });
}

export default function getAllowedChildren(
  element: HTMLElement,
  connector: WebbitConnector
): { slot: string; allowedChildren: string[] }[] {
  if (!element) {
    return [];
  }
  const config = connector.getMatchingElementConfig(element);
  if (!config) {
    return [];
  }
  return getAllowedChildrenByConfig(config, connector);
}
