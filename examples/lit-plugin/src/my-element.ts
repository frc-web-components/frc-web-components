import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getAssetUrl } from "@frc-web-components/app";

@customElement("my-lit-element")
export class MyElement extends LitElement {
  @property({ type: Number }) count = 0;

  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      background: var(--my-lit-element-background, cadetblue);
      color: var(--my-lit-element-color, black);
      border: none;
      border-radius: 3px;
      padding: 8px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  `;

  render() {
    return html`
      <button
        @click=${() => {
          this.count += 1;
        }}
      >
        <img src=${getAssetUrl("party.svg")} alt="party time" /> Party Guests:
        ${this.count}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-lit-element": MyElement;
  }
}
