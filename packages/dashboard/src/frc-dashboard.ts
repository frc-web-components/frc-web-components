import { LitElement } from 'lit';
import { WebbitConfig } from '@webbitjs/webbit';
import Dashboard from './dashboard';
import getAllowedChildren from './get-allowed-children';
import Layer from './layer';

export interface Tutorial {
  id: string;
  name: string;
  element?: string;
  html: string;
}

export default class FrcDashboard extends Dashboard {
  private layerElements = new Map<string, HTMLElement>();
  private tutorials: Record<string, Tutorial> = {};

  constructor(rootElement?: HTMLElement) {
    super(rootElement);
    this.subscribe('storeValueChange', (val: unknown): void => {
      const { key, value } = val as { key: string; value: boolean };
      if (key === 'drawerOpened') {
        this.publish('drawerToggle', { opened: value });
      } else if (key === 'selectedElement') {
        this.publish('elementSelect', { element: this.getSelectedElement() });
      } else if (key === 'previewedElement') {
        this.publish('elementPreview', { element: this.getPreviewedElement() });
      }
    });
  }

  openDrawer(): void {
    this.setStoreValue('drawerOpened', true);
  }

  closeDrawer(): void {
    this.setStoreValue('drawerOpened', false);
  }

  isDrawerOpened(): boolean {
    return this.getStoreValue('drawerOpened', false) as boolean;
  }

  setSelectedElement(element: HTMLElement): void {
    if (this.getSelectedElement() === element) {
      return;
    }
    this.setStoreValue('selectedElement', element);
    this.setStoreValue(
      'allowedChildren',
      getAllowedChildren(element, this.getConnector())
    );
  }

  setPreviewedElement(element: HTMLElement | null): void {
    if (this.getPreviewedElement() !== element) {
      this.setStoreValue('previewedElement', element);
    }
  }

  addElements(
    elementConfigs?: Record<string, Partial<WebbitConfig>>,
    group = 'default'
  ): void {
    super.addElements(elementConfigs, group);
    const selectedElement = this.getSelectedElement();
    if (selectedElement) {
      this.setStoreValue(
        'allowedChildren',
        getAllowedChildren(selectedElement, this.getConnector())
      );
    }
  }

  setHtml(html: string): void {
    super.setHtml(html);
    const tab = this.getConnector()
      .getRootElement()
      .querySelector('dashboard-tab') as HTMLElement;
    if (tab) {
      this.setSelectedElement(tab);
    }
  }

  resetHtml(): void {
    this.setHtml(`
      <dashboard-tab tab-name="TeleOperated" slot="tab" selected></dashboard-tab>
      <dashboard-tab slot="tab" tab-name="Autonomous"></dashboard-tab>
    `);
  }

  reloadHtml(): void {
    this.setHtml(this.getHtml());
  }

  getSelectedElement(): HTMLElement | null {
    return this.getStoreValue('selectedElement', null) as HTMLElement;
  }

  getPreviewedElement(): HTMLElement | null {
    return this.getStoreValue('previewedElement', null) as HTMLElement;
  }

  getAllowedChildren(): { slot: string; allowedChildren: string[] }[] {
    return this.getStoreValue('allowedChildren', []) as {
      slot: string;
      allowedChildren: string[];
    }[];
  }

  addLayer(id: string, layer: Layer): void {
    this.addComponent({
      type: 'layer',
      id,
      mount: ({ element }) => {
        layer.mount(element, this, id);
        return () => {
          layer.unmount(element, this, id);
        };
      },
    });
    const layerElement = this.create('layer', id, {});
    if (layerElement) {
      layerElement.setAttribute('slot', 'layer');
      layerElement.setAttribute('layer-id', id);
      layerElement.style.display = 'none';
      this.layerElements.set(id, layerElement);
    }
  }

  showLayer(id: string): void {
    const layerElement = this.layerElements.get(id);
    if (layerElement) {
      layerElement.style.display = 'block';
    }
  }

  hideLayer(id: string): void {
    const layerElement = this.layerElements.get(id);
    if (layerElement) {
      layerElement.style.display = 'none';
    }
  }

  getLayerElement(id: string): HTMLElement | undefined {
    return this.layerElements.get(id);
  }

  /**
   *
   * @param {string} id
   * @param {string} elementName
   */
  addPropertyInput(id: string, elementName: string): void {
    this.addComponent({
      type: 'propertyInput',
      id,
      mount({ dashboard, element, config }) {
        const propertyView = document.createElement(elementName);
        (propertyView as any).element = config.element;
        (propertyView as any).propertyHandler = config.propertyHandler;
        (propertyView as any).propertyName = config.propertyName;
        (propertyView as any).dashboard = dashboard;
        element.append(propertyView);

        const elementChangeListener = (ev: Event) => {
          dashboard.publish('propertyInputChange', (ev as CustomEvent).detail);
        };
        propertyView.addEventListener('change', elementChangeListener);

        const propertyInputChangeUnsubscriber = dashboard.subscribe(
          'propertyInputChange',
          () => {
            (propertyView as LitElement)?.requestUpdate();
          }
        );

        return () => {
          propertyView.removeEventListener('change', elementChangeListener);
          propertyInputChangeUnsubscriber();
          propertyView.remove();
        };
      },
    });
  }

  addElementEditor(id: string, elementName: string): void {
    this.addComponent({
      type: 'elementEditor',
      id,
      mount({ dashboard, element }) {
        const propertyView = document.createElement(elementName);
        (propertyView as any).dashboard = dashboard;
        element.append(propertyView);
        return () => {
          propertyView.remove();
        };
      },
    });
  }

  addTutorial(tutorial: Tutorial): void {
    this.tutorials[tutorial.id] = tutorial;
  }

  getTutorialIds(): string[] {
    return Object.keys(this.tutorials);
  }

  getTutorial(id: string): Tutorial | undefined {
    return this.tutorials[id];
  }

  showTutorial(id: string): void {
    const tutorial = this.getTutorial(id);
    if (tutorial) {
      const tab = this.addTab(tutorial.name, tutorial.html);
      tab.setAttribute('tutorial', '');
      tab.querySelectorAll('script').forEach((scriptElement) => {
        const clonedElement = document
          .createRange()
          .createContextualFragment(scriptElement.outerHTML);
        scriptElement.parentElement?.replaceChild(clonedElement, scriptElement);
      });
      this.setSelectedElement(tab);
    }
  }

  getElementTutorials(selector: string): Tutorial[] {
    const tutorials: Tutorial[] = [];
    Object.entries(this.tutorials).forEach(([, tutorial]) => {
      if (tutorial.element === selector) {
        tutorials.push(tutorial);
      }
    });
    return tutorials;
  }

  addTab(name: string, html?: string): HTMLElement {
    const tab = document.createElement('dashboard-tab');
    if (html) {
      tab.innerHTML = html;
    }
    tab.setAttribute('tab-name', name);
    tab.setAttribute('slot', 'tab');
    this.getRootElement().append(tab);
    return tab;
  }

  isElementEditable(
    element: HTMLElement | null = this.getSelectedElement()
  ): boolean {
    if (!element) {
      return true;
    }
    return (
      element.tagName.toLowerCase() !== 'dashboard-tab' ||
      !element.hasAttribute('tutorial')
    );
  }
}
