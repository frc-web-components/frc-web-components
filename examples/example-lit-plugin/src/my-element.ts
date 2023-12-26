import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("my-lit-element")
export class MyElement extends LitElement {
  @property() label = "";
  @property({ type: Number }) count = 0;

  render() {
    return html`
      <p>${this.label}: ${this.count}</p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-lit-element": MyElement;
  }
}
