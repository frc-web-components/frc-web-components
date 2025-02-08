import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import '../number-bar';
import '../voltage-view';

function getRange(start: number, end: number) {
  const range = [];
  for (let i = start; i < end; i += 1) {
    range.push(i);
  }
  return range;
}

export const elementName = 'frc-pdp';

export class Pdp extends LitElement {
  @property({ type: Number }) voltage = 0;
  @property({ type: Number, attribute: 'total-current' }) totalCurrent = 0;
  @property({ type: Array }) channels: number[] = Array(16).fill(0);

  static styles = css`
    :host {
      display: inline-block;
      width: 350px;
      margin: 5px;
      color: var(--frc-label-text-color, black);
      font-family: sans-serif;
      font-size: 16px;
    }

    [part='channels'] {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: min-content 1fr min-content 1fr;
      grid-template-rows: auto auto auto auto auto auto auto auto;
      width: 100%;
      height: auto;
      align-items: center;
      gap: 3px;
    }

    .channel,
    .voltage,
    .total-current {
      width: auto;
    }

    [part='channel-label'] {
      padding-left: 5px;
      text-align: right;
      white-space: nowrap;
    }

    [part='voltage-and-total-current'] {
      margin-top: 5px;
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: min-content auto;
      grid-template-rows: auto auto;
      column-gap: 10px;
      width: 100%;
      height: auto;
      align-items: center;
      gap: 3px;
    }

    [part='voltage-and-total-current'] {
      white-space: nowrap;
    }
  `;

  renderChannel(channelNumber: number) {
    return html`
      <frc-number-bar
        class="channel"
        part="channel"
        value=${this.channels[channelNumber] ?? 0}
        min="0"
        max="40"
        center="0"
        precision="2"
        ?hide-text="${false}"
        num-tick-marks="0"
        unit="A"
      ></frc-number-bar>
    `;
  }

  render() {
    return html`
      <div part="channels">
        ${getRange(0, 8).map(
          (number) => html`
            <label part="channel-label">
              <slot name="${`channel-label${number}`}">Ch. ${number}</slot>
            </label>
          `,
        )}
        ${getRange(0, 8).map((number) => html` ${this.renderChannel(number)} `)}
        ${getRange(8, 16).map(
          (number) => html`
            <label part="channel-label">
              <slot name="${`channel-label${number}`}">Ch. ${number}</slot>
            </label>
          `,
        )}
        ${getRange(8, 16).map(
          (number) => html` ${this.renderChannel(number)} `,
        )}
      </div>
      <div part="voltage-and-total-current">
        <label part="voltage-label">
          <slot name="voltage-label">Voltage</slot>
        </label>
        <label part="total-current-label">
          <slot name="total-current">Total Current</slot>
        </label>
        <frc-voltage-view
          class="voltage"
          part="voltage"
          value="${this.voltage}"
          min="0"
          max="15"
          center="0"
          precision="2"
          ?hide-text="${false}"
          num-tick-marks="0"
        ></frc-voltage-view>
        <frc-number-bar
          class="total-current"
          part="total-current"
          value="${this.totalCurrent}"
          min="0"
          max="500"
          center="0"
          precision="2"
          ?hide-text="${false}"
          num-tick-marks="0"
          unit="A"
        ></frc-number-bar>
      </div>
    `;
  }
}

export default Pdp;

if (!customElements.get('frc-pdp')) {
  customElements.define('frc-pdp', Pdp);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-pdp': Pdp;
  }
}
