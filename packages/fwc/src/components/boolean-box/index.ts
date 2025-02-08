import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export const booleanBoxDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Boolean Box',
  },
  properties: {
    value: { type: 'Boolean', primary: true },
    trueColor: {
      type: 'String',
      input: { type: 'ColorPicker' },
      defaultValue: '#00ff00',
      attribute: 'true-color',
    },
    falseColor: {
      type: 'String',
      input: { type: 'ColorPicker' },
      defaultValue: '#ff0000',
      attribute: 'false-color',
    },
    label: { type: 'String' },
  },
};

export class BooleanBox extends LitElement {
  static DEFAULT_FALSE_COLOR = '#ff0000';
  static DEFAULT_TRUE_COLOR = '#00ff00';
  @property({ type: Boolean }) value = false;
  @property({ type: String, attribute: 'false-color' }) falseColor =
    BooleanBox.DEFAULT_FALSE_COLOR;
  @property({ type: String, attribute: 'true-color' }) trueColor =
    BooleanBox.DEFAULT_TRUE_COLOR;
  @property({ type: String }) label = '';

  static styles = css`
    :host {
      display: inline-block;
      width: 80px;
      height: 80px;
      padding: 5px;
      box-sizing: border-box;
    }

    [part='box'] {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      background-color: var(--box-color);
      text-align: center;
    }
  `;

  updated() {
    const falseColor = this.falseColor || BooleanBox.DEFAULT_FALSE_COLOR;
    const trueColor = this.trueColor || BooleanBox.DEFAULT_TRUE_COLOR;
    const backgroundNode = this.renderRoot.querySelector(
      '[part=box]',
    ) as HTMLElement;
    const backgroundColor = this.value ? trueColor : falseColor;
    backgroundNode.style.setProperty('--box-color', backgroundColor);
  }

  render() {
    return html` <div part="box">${this.label || html`&nbsp;`}</div> `;
  }
}

export default BooleanBox;

if (!customElements.get('frc-boolean-box')) {
  customElements.define('frc-boolean-box', BooleanBox);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-boolean-box': BooleanBox;
  }
}
