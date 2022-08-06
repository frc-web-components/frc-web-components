
export default function getElementHtml(connector, selector) {
  const config = connector.getElementConfig(selector);

  if (config?.demos) {
    const [{ html }] = config.demos;
    return html;
  }

  return `<${selector}></${selector}>`;
}