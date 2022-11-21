export function createSheet(): CSSStyleSheet {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(''));
  document.head.appendChild(style);
  return style.sheet as CSSStyleSheet;
}

export function addCSSRule(sheet: CSSStyleSheet, rules: string): void {
  sheet.insertRule(rules);
}
