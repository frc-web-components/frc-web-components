import { LitElement } from 'lit';
import { WebbitConfig } from '@webbitjs/webbit';
import Dashboard from './dashboard';
import getAllowedChildren from './get-allowed-children';
import Layer from './layer';

export default class FrcDashboard extends Dashboard {
  private layerElements = new Map<string, HTMLElement>();

  constructor(rootElement?: HTMLElement) {
    super(rootElement);
    this.subscribe('storeValueChange', (val: unknown): void => {
      const { key, value } = val as { key: string, value: boolean };
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
    this.setStoreValue('selectedElement', element);
    this.setStoreValue('allowedChildren', getAllowedChildren(element, this.getConnector()));
  }

  setPreviewedElement(element: HTMLElement): void {
    this.setStoreValue('previewedElement', element);
  }

  addElements(elementConfigs?: Record<string, Partial<WebbitConfig>>, group = 'default'): void {
    super.addElements(elementConfigs, group);
    const selectedElement = this.getSelectedElement();
    if (selectedElement) {
      this.setStoreValue('allowedChildren', getAllowedChildren(selectedElement, this.getConnector()));
    }
  }

  setHtml(html: string): void {
    super.setHtml(html);
    const tab = this.getConnector().getRootElement().querySelector('dashboard-tab') as HTMLElement;
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

  getAllowedChildren(): { slot: string, allowedChildren: string[] }[] {
    return this.getStoreValue('allowedChildren', []) as ({ slot: string, allowedChildren: string[] }[]);
  }

  addLayer(id: string, layer: Layer): void {
    this.addComponent({
      type: 'layer',
      id,
      mount: ({ element }) => {
        layer.mount(element, this);
        return () => {
          layer.unmount(element, this);
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

        const propertyInputChangeUnsubscriber = dashboard.subscribe('propertyInputChange', () => {
          (propertyView as LitElement)?.requestUpdate();
        });

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

  addTopDrawerTab(id: string, elementName: string): void {
    this.addComponent({
      type: 'topDrawerTab',
      id,
      mount({ dashboard, element }) {
        const tab = document.createElement(elementName);
        (tab as any).dashboard = dashboard;
        element.append(tab);
        return () => {
          tab.remove();
        };
      },
    });
  }

  addBottomDrawerTab(id: string, elementName: string): void {
    this.addComponent({
      type: 'bottomDrawerTab',
      id,
      mount({ dashboard, element }) {
        const tab = document.createElement(elementName);
        (tab as any).dashboard = dashboard;
        element.append(tab);
        return () => {
          tab.remove();
        };
      },
    });
  }
}
