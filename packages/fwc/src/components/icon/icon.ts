import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { WebbitConfig } from '@webbitjs/webbit';
import iconset from './iconset';

export const iconDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Icon',
    defaultHtml: `<frc-icon icon="${Object.keys(iconset)[0]}"></frc-icon>`,
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
      attribute: 'svg-path',
      defaultValue: '',
      input: {
        isDisabled({ icon }: { icon: string }): boolean {
          return icon !== 'Custom';
        },
      },
    },
    viewBox: {
      type: 'String',
      attribute: 'view-box',
      defaultValue: '0 0 24 24',
      input: {
        isDisabled({ icon }: { icon: string }): boolean {
          return icon !== 'Custom';
        },
      },
    },
  },
};

export class Icon extends LitElement {
  @property({ type: String }) color = '#000000';
  @property({ type: String }) icon = '';
  @property({ type: String, attribute: 'svg-path' }) svgPath = '';
  @property({ type: String, attribute: 'view-box' }) viewBox = '0 0 24 24';

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

export default Icon;

if (!customElements.get('frc-icon')) {
  customElements.define('frc-icon', Icon);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-icon': Icon;
  }
}
