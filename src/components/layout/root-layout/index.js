import { Webbit, html, css } from '@webbitjs/webbit';

export default class RootLayout extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Root Layout',
      allowedParents: [],
      // slots: ['default', 'scripts', 'styles', 'source-defaults'],
      slots: ['default', 'scripts', 'source-defaults'],
      allowedChildren: {
        scripts: ['script'],
        // styles: ['style'],
        'source-defaults': [
          'frc-nt-boolean-default',
          'frc-nt-number-default',
          'frc-nt-string-default',
          'frc-nt-boolean-array-default',
          'frc-nt-number-array-default',
          'frc-nt-string-array-default',
        ]
      },
      editorTabs: ['addElements'],
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        max-width: 100%;
        max-height: 100%;
        width: 100vw;
        height: 100vh;
        position: relative;
      }

      ::slotted(*) {
        position: absolute;
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <slot></slot>
      <slot name="script"></slot>
      <slot name="style"></slot>
      <slot name="source-defaults"></slot>
      <slot
    `;
  }
}

webbitRegistry.define('frc-root-layout', RootLayout);