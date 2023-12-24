/* eslint-disable import/extensions */
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import iconset from './iconset';

export default {
  dashboard: {
    displayName: 'Icon',
  },
  properties: {
    color: {
      type: 'String',
      defaultValue: '#000000',
      input: { type: 'ColorPicker' },
    },
    icon: {
      type: 'String',
      defaultValue: Object.keys(iconset)[0],
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions(): string[] {
          return ['Custom'].concat(Object.keys(iconset));
        },
      },
    },
    svgPath: {
      type: 'String',
      defaultValue: '',
      input: {
        isDisabled({ icon }: { icon: string }): boolean {
          return icon !== 'Custom';
        },
      },
    },
    viewBox: {
      type: 'String',
      defaultValue: '0 0 24 24',
      input: {
        isDisabled({ icon }: { icon: string }): boolean {
          return icon !== 'Custom';
        },
      },
    },
  },
};

@customElement('frc-icon')
export class Icon extends LitElement {
  @property({ type: String }) color = '#000000';
  @property({ type: String }) icon = Object.keys(iconset)[0];
  @property({ type: String }) svgPath = '';
  @property({ type: String }) viewBox = '0 0 24 24';

  static styles = css`
    :host {
      display: inline-block;
      width: 24px;
      height: 24px;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `;

  render(): TemplateResult {
    const isCustom = this.icon === 'Custom' || !this.icon;
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox=${isCustom ? this.viewBox : '0 0 24 24'}
        width="24px"
        fill=${this.color}
      >
        <path d=${isCustom ? this.svgPath : iconset[this.icon]} />
      </svg>
    `;
  }
}
