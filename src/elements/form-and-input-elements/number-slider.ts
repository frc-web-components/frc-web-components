/* eslint-disable import/extensions */
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export const numberSliderConfig = {
  dashboard: {
    displayName: 'Number Slider',
  },
  properties: {
    value: { type: 'Number', primary: true, changeEvent: 'change' },
    min: { type: 'Number', defaultValue: -1 },
    max: { type: 'Number', defaultValue: 1 },
    blockIncrement: {
      type: 'Number',
      attribute: 'block-increment',
      defaultValue: 0.05,
    },
  },
};

@customElement('frc-number-slider')
export class NumberSlider extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = -1;
  @property({ type: Number }) max = 1;
  @property({ type: Number, attribute: 'block-increment' })
  blockIncrement = 0.05;

  static styles = css`
    :host {
      display: inline-block;
      height: 50px;
      width: 300px;
    }

    .slider-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 15px;
    }

    input {
      width: 100%;
    }

    table-axis {
      width: calc(85% - 14px);
      max-width: calc(100% - 74px);
      display: block;
    }
  `;

  onChange(ev: Event): void {
    this.value = parseFloat((ev as any).target.value);
    this.#dispatchChange();
  }

  #dispatchChange(): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  firstUpdated(): void {
    // The value is not initially being set for fractions for some reason
    setTimeout(() => {
      const slider: HTMLFormElement | null =
        this.renderRoot.querySelector('#slider');
      if (slider) {
        slider.value = this.value;
      }
    });
  }

  render(): TemplateResult {
    const min = Math.min(this.min, this.max);
    const max = Math.max(this.min, this.max);
    const value = Math.max(min, Math.min(this.value, max));

    return html`
      <div class="slider-container">
        <input
          id="slider"
          type="range"
          .value="${value.toString()}"
          min="${min}"
          max="${max}"
          step="${this.blockIncrement}"
          @change="${this.onChange}"
        />

        <frc-table-axis
          ticks="5"
          .range="${[this.min, this.max]}"
        ></frc-table-axis>
      </div>
    `;
  }
}
