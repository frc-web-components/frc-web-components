import { Widget, html, css } from '@lit-dashboard/lit-dashboard';
import { registerWidget } from '@lit-dashboard/lit-dashboard/app';

const ENABLED_FLAG = 0x01;
const AUTO_FLAG = 0x02;
const TEST_FLAG = 0x04;
const EMERGENCY_STOP_FLAG = 0x08;
const FMS_ATTACHED_FLAG = 0x10;
const DS_ATTACHED_FLAG = 0x20;

const MATCH_TYPES = ['Unknown', 'Practice', 'Qualification', 'Elimination'];

class BasicFmsInfo extends Widget {

  static get styles() {
    return css`
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
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      [icon="vaadin:check"] {
        color: green;
      }

      [icon="vaadin:close-small"] {
        color: red;
      }
    `;
  }

  getRobotState() {
    if (this.isEnabled()) {
      if (this.isTest()) {
        return 'Test';
      } 
      else if (this.isAuto()) {
        return 'Autonomous';
      } 
      else {
        return 'Teleoperated';
      }
    } 
    else {
      return 'Disabled';
    }
  }

  getMatchType() {
    return this.hasSource() ? MATCH_TYPES[this.sourceValue.matchType] : '';
  }

  getMatchNumber() {
    return this.hasSource() ? this.sourceValue.matchNumber : 0;
  }

  getEventName() {
    return this.hasSource() ? this.sourceValue.eventName : '';
  }

  isEnabled() {
    return !!(this.sourceValue.fmsControlData & ENABLED_FLAG);
  }

  isAuto() {
    return !!(this.sourceValue.fmsControlData & AUTO_FLAG);
  }

  isTest() {
    return !!(this.sourceValue.fmsControlData & TEST_FLAG);
  };

  isEmergencyStopped() {
    return !!(this.sourceValue.fmsControlData & EMERGENCY_STOP_FLAG);
  }

  isFmsAttached() {
    return !!(this.sourceValue.fmsControlData & FMS_ATTACHED_FLAG);
  }

  isDsAttached() {
    return !!(this.sourceValue.fmsControlData & DS_ATTACHED_FLAG);
  }

  render() {
    return html`
      <p>
        <strong>
          <span>${this.getEventName()}</span>
          <span>${this.getMatchType()}</span>
          <span>match ${this.getMatchNumber()}</span>
        </strong>
      </p>
      
      <p style="margin-bottom: 7px; font-weight: normal">
        <span style="margin-right: 5px;">
          ${this.isFmsAttached() ? html`
            <span>
              <iron-icon icon="vaadin:check"></iron-icon>
              FMS connected
            </span>
          ` : html`
            <span>
              <iron-icon icon="vaadin:close-small"></iron-icon> 
              FMS disconnected
            </span>
          `}
        </span>
        <span>
          ${this.isDsAttached() ? html`
            <span>
            <iron-icon icon="vaadin:check"></iron-icon>
              DriverStation connected
            </span>
          ` : html`
            <span>
              <iron-icon icon="vaadin:close-small"></iron-icon> 
              DriverStation disconnected
            </span>
          `}
        </span>
      </p>

      <p style="font-weight: normal">
        Robot state: ${this.getRobotState()}
      </p>
    `;
  }
}

registerWidget('basic-fms-info', {
  class: BasicFmsInfo,
  label: 'Basic FMS Info',
  category: 'FRC',
  acceptedTypes: ['FMSInfo'],
  image: require.resolve('./basic-fms-info.png')
});