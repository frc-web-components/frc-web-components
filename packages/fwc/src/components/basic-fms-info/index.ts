import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import '../icon';
import { WebbitConfig } from '@webbitjs/webbit';

export const basicFmsInfoDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Basic FMS Info',
  },
  properties: {
    matchType: { type: 'Number', attribute: 'match-type' },
    matchNumber: { type: 'Number', attribute: 'match-number' },
    eventName: { type: 'String', attribute: 'event-name' },
    fmsControlData: { type: 'Number', attribute: 'fms-control-data' },
  },
};

const ENABLED_FLAG = 0x01;
const AUTO_FLAG = 0x02;
const TEST_FLAG = 0x04;
const EMERGENCY_STOP_FLAG = 0x08;
const FMS_ATTACHED_FLAG = 0x10;
const DS_ATTACHED_FLAG = 0x20;

const MATCH_TYPES = ['Unknown', 'Practice', 'Qualification', 'Elimination'];

export class BasicFmsInfo extends LitElement {
  @property({ type: Number, attribute: 'match-type' }) matchType = 0;
  @property({ type: Number, attribute: 'match-number' }) matchNumber = 0;
  @property({ type: String, attribute: 'event-name' }) eventName = '';
  @property({ type: Number, attribute: 'fms-control-data' }) fmsControlData = 0;

  static styles = css`
    p {
      margin: 5px 0;
    }
    p:first-child {
      margin-top: 0;
    }
    p:last-child {
      margin: 0;
    }
    :host {
      text-align: center;
      font-size: 15px;
      display: inline-flex;
      width: auto;
      flex-direction: column;
      justify-content: center;
      font-family: sans-serif;
      color: var(--frc-basic-fms-info-text-color, #000);
    }

    .info {
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
  `;

  getRobotState(): string {
    if (this.isEnabled()) {
      if (this.isTest()) {
        return 'Test';
      }
      if (this.isAuto()) {
        return 'Autonomous';
      }
      return 'Teleoperated';
    }
    return 'Disabled';
  }

  isEnabled(): boolean {
    return !!(this.fmsControlData & ENABLED_FLAG);
  }

  isAuto(): boolean {
    return !!(this.fmsControlData & AUTO_FLAG);
  }

  isTest(): boolean {
    return !!(this.fmsControlData & TEST_FLAG);
  }

  isEmergencyStopped(): boolean {
    return !!(this.fmsControlData & EMERGENCY_STOP_FLAG);
  }

  isFmsAttached(): boolean {
    return !!(this.fmsControlData & FMS_ATTACHED_FLAG);
  }

  isDsAttached(): boolean {
    return !!(this.fmsControlData & DS_ATTACHED_FLAG);
  }

  render() {
    return html`
      <p>
        <strong>
          <span>${this.eventName}</span>
          <span>${MATCH_TYPES[this.matchType]}</span>
          <span>match ${this.matchNumber}</span>
        </strong>
      </p>

      <p style="margin-bottom: 7px; font-weight: normal">
        <span style="margin-right: 5px;">
          ${this.isFmsAttached()
            ? html`
                <span class="info">
                  <frc-icon icon="check" color="green"></frc-icon>
                  FMS connected
                </span>
              `
            : html`
                <span class="info">
                  <frc-icon icon="close" color="red"></frc-icon>
                  FMS disconnected
                </span>
              `}
        </span>
        <span>
          ${this.isDsAttached()
            ? html`
                <span class="info">
                  <frc-icon icon="check" color="green"></frc-icon>
                  DriverStation connected
                </span>
              `
            : html`
                <span class="info">
                  <frc-icon icon="close" color="red"></frc-icon>
                  DriverStation disconnected
                </span>
              `}
        </span>
      </p>
      <p style="font-weight: normal">Robot state: ${this.getRobotState()}</p>
    `;
  }
}

export default BasicFmsInfo;

if (!customElements.get('frc-basic-fms-info')) {
  customElements.define('frc-basic-fms-info', BasicFmsInfo);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-basic-fms-info': BasicFmsInfo;
  }
}
