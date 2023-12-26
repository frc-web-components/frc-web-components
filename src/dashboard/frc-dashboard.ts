import { WebbitConfig } from '@webbitjs/webbit';
import Dashboard from './dashboard';
import { createLayerElement } from './layer';
import { addCSSRule, createSheet } from './themes';

export default class FrcDashboard extends Dashboard {
  private layers: Record<string, HTMLElement> = {};
  private themeSheets: Record<string, CSSStyleSheet> = {};

  constructor(rootElement?: HTMLElement) {
    super(rootElement);
    this.subscribe('storeValueChange', (val: unknown): void => {
      const { key, value } = val as { key: string; value: boolean };
      if (key === 'drawerOpened') {
        this.publish('drawerToggle', { opened: value });
      } else if (key === 'selectedElement') {
        this.publish('elementSelect', { element: this.getSelectedElement() });
      }
    });
    this.getRootElement().setAttribute('data-theme', this.getTheme());
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
  }

  addElements(
    elementConfigs?: Record<string, Partial<WebbitConfig>>,
    group = 'default'
  ): void {
    super.addElements(elementConfigs, group);
    this.publish('elementsAdd');
  }

  setHtml(html: string): void {
    super.setHtml(html);
    const tab = this.getConnector()
      .getRootElement()
      .querySelector('dashboard-tab') as HTMLElement;
    if (tab) {
      this.setSelectedElement(tab);
    }
    this.publish('htmlSet');
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
    return element.tagName.toLowerCase() !== 'dashboard-tab';
  }

  addLayer(name: string): HTMLElement {
    if (this.layers[name]) {
      return this.layers[name];
    }
    this.layers[name] = createLayerElement(name);
    this.publish('layerAdd', { layer: this.layers[name] });
    return this.layers[name];
  }

  hasLayer(name: string): boolean {
    return !!this.layers[name];
  }

  getLayer(name: string): HTMLElement | undefined {
    return this.layers[name];
  }

  getLayers(): Record<string, HTMLElement> {
    return this.layers;
  }

  addThemeRules(theme: string, cssVariables: Record<string, string>): void {
    if (typeof this.themeSheets[theme] === 'undefined') {
      this.themeSheets[theme] = createSheet();
    }

    const rules = Object.entries(cssVariables).map(
      ([variableName, value]) => `${variableName}: ${value};`
    );
    addCSSRule(
      this.themeSheets[theme],
      `
      [data-theme="${theme}"] {
        ${rules.join('\n')}
      }
    `
    );
    this.publish('themeRulesAdd');
  }

  setTheme(theme: string): void {
    this.getRootElement().setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.setStoreValue('theme', theme);
    this.publish('themeSet');
  }

  getTheme(): string {
    const storedTheme = localStorage.getItem('theme') ?? 'dark';
    return this.getStoreValue('theme', storedTheme) as string;
  }

  getThemes(): string[] {
    const themes = ['light', ...Object.keys(this.themeSheets)];
    return [...new Set(themes).values()];
  }
}
