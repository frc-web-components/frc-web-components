import { WebbitConnector, WebbitConfig } from '@webbitjs/webbit';
import { Store, SourceProvider } from '@webbitjs/store';
import { html as beautifyHtml } from 'js-beautify';
import KeyStore from './KeyStore';

function getFormattedHtml(html: string) {
  return beautifyHtml(html, {
    wrap_attributes: 'force-expand-multiline',
  });
}

type ComponentRenderer = (params: {
  // eslint-disable-next-line no-use-before-define
  dashboard: Dashboard;
  element: HTMLElement;
  config: Record<string, unknown>;
}) => (() => void) | undefined;

interface DashboardComponent {
  type: string;
  id: string;
  mount: ComponentRenderer;
}

type SubscriberCallback = (...args: unknown[]) => unknown;

export default class Dashboard {
  private store: Store = new Store();
  private connector;
  private components = new Map<symbol, DashboardComponent>();
  private mountedElements = new Map<
    HTMLElement,
    {
      componentId: string;
      componentType: string;
      config: Record<string, unknown>;
      unmount:
        | ((props: {
            config: Record<string, unknown>;
            dashboard: Dashboard;
            element: HTMLElement;
          }) => void)
        | undefined;
    }
  >();

  private subscribers = new Map<string, Map<symbol, SubscriberCallback>>();
  private componentKeys = new KeyStore(2);
  private dashboardState = new Store();
  private provider = new SourceProvider();

  constructor(rootElement?: HTMLElement) {
    this.connector = new WebbitConnector(
      rootElement ?? document.createElement('div'),
      this.store
    );
    this.dashboardState.addSourceProvider('dashboardState', this.provider);
    this.dashboardState.subscribeAll(
      'dashboardState',
      (value, key) => {
        this.publish('storeValueChange', { value, key });
      },
      false
    );
  }

  addSourceProvider(
    providerName: string,
    sourceProvider: SourceProvider
  ): void {
    this.store.addSourceProvider(providerName, sourceProvider);
  }

  setDefaultSourceProvider(providerName: string): void {
    this.store.setDefaultSourceProvider(providerName);
  }

  setStoreValue(key: string, value: unknown): void {
    this.provider.updateSource(key, value);
  }

  getStoreValue(key: string, defaultValue: unknown = undefined): unknown {
    return (
      this.dashboardState.getSourceValue('dashboardState', key) ?? defaultValue
    );
  }

  getConnector(): WebbitConnector {
    return this.connector;
  }

  getRootElement(): HTMLElement {
    return this.connector.getRootElement();
  }

  getStore(): Store {
    return this.connector.getStore();
  }

  addComponent(component: DashboardComponent): void {
    const key = this.componentKeys.getKey(component.type, component.id);
    if (key) {
      this.components.set(key, component);
    }
  }

  hasComponent(type: string, id: string): boolean {
    const componentKey = this.componentKeys.getKey(type, id);
    if (componentKey) {
      return this.components.has(componentKey);
    }
    return false;
  }

  getComponentIdsOfType(type: string): string[] {
    return [...this.components.values()]
      .filter(({ type: componentType }) => componentType === type)
      .map(({ id }) => id);
  }

  create(
    componentType: string,
    componentId: string,
    config: Record<string, unknown> = {}
  ): HTMLElement | undefined {
    const element = document.createElement('div');
    const componentKey = this.componentKeys.getKey(componentType, componentId);
    if (!componentKey) {
      return undefined;
    }
    const component = this.components.get(componentKey);
    if (component) {
      const unmount = component.mount({
        dashboard: this,
        element,
        config,
      });
      this.mountedElements.set(element, {
        componentId,
        componentType,
        config,
        unmount,
      });
      return element;
    }
    return undefined;
  }

  /**
   * Unmounts the mounted component from a particular element
   * @param {HTMLElement} element
   */
  unmount(element: HTMLElement): void {
    const mountedElement = this.mountedElements.get(element);
    if (mountedElement) {
      const { config, unmount } = mountedElement;
      if (unmount) {
        unmount({
          dashboard: this,
          element,
          config,
        });
      }
      this.mountedElements.delete(element);
    }
  }

  /**
   *
   * @returns {() => void} A function to unsubscribe
   */
  subscribe(
    subscriberId: string,
    subscriber: (...args: unknown[]) => unknown
  ): () => void {
    if (!this.subscribers.has(subscriberId)) {
      this.subscribers.set(subscriberId, new Map());
    }
    const id = Symbol('');
    const subscribers = this.subscribers.get(subscriberId);
    subscribers?.set(id, subscriber);
    return () => {
      subscribers?.delete(id);
    };
  }

  /**
   *
   * @param {string} subscriberId
   * @param {unknown} context
   */
  publish(subscriberId: string, context: Record<string, unknown> = {}): void {
    if (!this.subscribers.has(subscriberId)) {
      return;
    }
    this.subscribers.get(subscriberId)?.forEach((subscriber) => {
      subscriber(context);
    });
  }

  addElements(
    elementConfigs?: Record<string, Partial<WebbitConfig>>,
    group = 'default'
  ): void {
    this.connector.addElementConfigs(elementConfigs, group);
  }

  getHtml(): string {
    return this.getElementHtml(this.connector.getRootElement(), true);
  }

  setHtml(html: string): void {
    this.connector
      .getRootElement()
      .querySelectorAll('dashboard-tab')
      .forEach((tab) => {
        tab.remove();
      });
    const container = document.createElement('div');
    container.innerHTML = html;
    container.querySelectorAll('dashboard-tab').forEach((tab) => {
      tab.setAttribute('slot', 'tab');
      this.connector.getRootElement().append(tab);
    });
  }

  getElementDisplayName(element: HTMLElement): string {
    const config = this.connector.getMatchingElementConfig(element);
    const tagName = element.tagName.toLowerCase();
    if (!config?.dashboard) {
      return tagName;
    }
    if (typeof config.dashboard.displayName === 'string') {
      return config.dashboard.displayName;
    }
    if (typeof config.dashboard.displayName === 'function') {
      return config.dashboard.displayName(element);
    }
    return tagName;
  }

  getSelectorDisplayName(selector: string): string {
    const config = this.connector.getElementConfig(selector);
    if (!config?.dashboard) {
      return selector;
    }
    if (typeof config.dashboard.displayName === 'string') {
      return config.dashboard.displayName;
    }
    return selector;
  }

  getElementHtml(element: HTMLElement, inner = false): string {
    const clonedElement = element.cloneNode(true) as HTMLElement;
    this.setClonedElementPropAttributes(element, clonedElement);
    return getFormattedHtml(
      inner ? clonedElement.innerHTML : clonedElement.outerHTML
    );
  }

  private setClonedElementPropAttributes(
    element: HTMLElement,
    clonedElement: HTMLElement
  ): void {
    const webbit = this.connector.getElementWebbit(element);
    if (webbit) {
      const { properties } = webbit.getConfig();
      Object.entries(properties).forEach(
        ([name, { attribute, defaultValue }]) => {
          const handler = webbit.getPropertyHandler(name);
          if (handler?.isAttribute() && attribute) {
            const attributeValue = handler.getStoredAttribute();
            if (
              attributeValue === null ||
              handler.getStoredValue() === defaultValue
            ) {
              clonedElement.removeAttribute(attribute);
            } else {
              clonedElement.setAttribute(attribute, attributeValue);
            }
          }
        }
      );
    }
    for (let i = 0; i < element.children.length; i += 1) {
      this.setClonedElementPropAttributes(
        element.children[i] as HTMLElement,
        clonedElement.children[i] as HTMLElement
      );
    }
  }
}
