import { html, LitElement, css } from 'lit';

export const elementName = 'frc-if';

export const elementConfig = {
  properties: {
    value: { type: Boolean },
  },
  slots: [{ name: 'true' }, { name: 'false' }],
  dashboard: {
    displayName: 'If',
    layout: {
      type: 'absolute',
    },
  },
  demos: [
    {
      html: `
      <frc-if>
        <span slot="true">Visible if true</span>
        <span slot="false">Visible if false</span>
      </frc-if>
    `,
    },
  ],
};

class If extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: inline-block;
      position: absolute;
      color: var(--frc-label-text-color, black);
    }
  `;

  render() {
    if (this.value) {
      return html` <slot name="true"></slot> `;
    }
    return html` <slot name="false"></slot> `;
  }
}

customElements.define(elementName, If);
