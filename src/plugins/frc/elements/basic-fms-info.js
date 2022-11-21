import { html, css, LitElement } from 'lit';

const ENABLED_FLAG = 0x01;
const AUTO_FLAG = 0x02;
const TEST_FLAG = 0x04;
const EMERGENCY_STOP_FLAG = 0x08;
const FMS_ATTACHED_FLAG = 0x10;
const DS_ATTACHED_FLAG = 0x20;

const MATCH_TYPES = ['Unknown', 'Practice', 'Qualification', 'Elimination'];

export const elementName = 'frc-basic-fms-info';

export const elementConfig = {
  dashboard: {
    displayName: 'Basic FMS Info',
  },
  properties: {
    matchType: { type: Number, attribute: 'match-type' },
    matchNumber: { type: Number, attribute: 'match-number' },
    eventName: { type: String, attribute: 'event-name' },
    fmsControlData: { type: Number, attribute: 'fms-control-data' },
  },
};

class BasicFmsInfo extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    p {
      margin: 5px 0;
    }
    p:first-child {
      margin-top: 0;
    }
    p:last-child {
      margin-bottom: 0;
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
    [icon='vaadin:check'] {
      color: green;
    }
    [icon='vaadin:close-small'] {
      color: red;
    }
  `;

  constructor() {
    super();
    this.matchType = 0;
    this.matchNumber = 0;
    this.eventName = '';
    this.fmsControlData = 0;
  }

  getRobotState() {
    if (this.isEnabled()) {
      if (this.isTest()) {
        return 'Test';
      } else if (this.isAuto()) {
        return 'Autonomous';
      } else {
        return 'Teleoperated';
      }
    } else {
      return 'Disabled';
    }
  }

  isEnabled() {
    return !!(this.fmsControlData & ENABLED_FLAG);
  }

  isAuto() {
    return !!(this.fmsControlData & AUTO_FLAG);
  }

  isTest() {
    return !!(this.fmsControlData & TEST_FLAG);
  }

  isEmergencyStopped() {
    return !!(this.fmsControlData & EMERGENCY_STOP_FLAG);
  }

  isFmsAttached() {
    return !!(this.fmsControlData & FMS_ATTACHED_FLAG);
  }

  isDsAttached() {
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
                <span>
                  <vaadin-icon icon="vaadin:check"></vaadin-icon>
                  FMS connected
                </span>
              `
            : html`
                <span>
                  <vaadin-icon icon="vaadin:close-small"></vaadin-icon>
                  FMS disconnected
                </span>
              `}
        </span>
        <span>
          ${this.isDsAttached()
            ? html`
          <span>
            <vaadin-vaadin icon="vaadin:check"></vaadin-icon>
            DriverStation connected
          </span>
          `
            : html`
                <span>
                  <vaadin-icon icon="vaadin:close-small"></vaadin-icon>
                  DriverStation disconnected
                </span>
              `}
        </span>
      </p>
      <p style="font-weight: normal">Robot state: ${this.getRobotState()}</p>
    `;
  }
}

customElements.define(elementName, BasicFmsInfo);
