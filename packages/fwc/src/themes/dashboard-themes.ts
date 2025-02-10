class DashboardThemes {
  private themeSheets: Record<string, CSSStyleSheet> = {};
  private themeAttribute: string;

  constructor(themeAttribute = 'data-theme') {
    this.themeAttribute = themeAttribute;
  }

  static createSheet(): CSSStyleSheet {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    return style.sheet as CSSStyleSheet;
  }

  addThemeRules(theme: string, cssVariables: Record<string, string>): void {
    if (typeof this.themeSheets[theme] === 'undefined') {
      this.themeSheets[theme] = DashboardThemes.createSheet();
    }

    const rules = Object.entries(cssVariables).map(
      ([variableName, value]) => `${variableName}: ${value};`,
    );
    this.themeSheets[theme].insertRule(`
      [${this.themeAttribute}="${theme}"] {
        ${rules.join('\n')}
      }
    `);
  }

  setTheme(element: HTMLElement, theme: string): void {
    element.setAttribute(this.themeAttribute, theme);
  }

  getTheme(element: HTMLElement): string | undefined {
    return element.getAttribute(this.themeAttribute) ?? undefined;
  }
}

export default DashboardThemes;
