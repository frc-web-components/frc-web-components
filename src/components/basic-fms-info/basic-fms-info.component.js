import { html, css } from 'lit-element';
import { Webbit, define } from '../../webbit';

const ENABLED_FLAG = 0x01;
const AUTO_FLAG = 0x02;
const TEST_FLAG = 0x04;
const EMERGENCY_STOP_FLAG = 0x08;
const FMS_ATTACHED_FLAG = 0x10;
const DS_ATTACHED_FLAG = 0x20;

const MATCH_TYPES = ['Unknown', 'Practice', 'Qualification', 'Elimination'];

class BasicFmsInfo extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Basic FMS Info',
      category: 'Robot & Field Info',
      description: 'Component for displaying data from the FMS',
      documentationLink: 'https://frc-web-components.github.io/components/basic-fms-info/',
      slots: [],
      defaultSourceKey: '/fmsInfo',
      defaultSourceProvider: 'NetworkTables',
    };
  }

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
        display: inline-flex;
        width: auto;
        flex-direction: column;
        justify-content: center;
        font-family: sans-serif;
      }
      [icon="vaadin:check"] {
        color: green;
      }
      [icon="vaadin:close-small"] {
        color: red;
      }
    `;
  }

  static get properties() {
    return {
      matchType: { type: Number, defaultValue: 0 },
      matchNumber: { type: Number, defaultValue: 0 },
      eventName: { type: String, defaultValue: '' },
      fmsControlData: { type: Number, defaultValue: 0 }
    };
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

define('frc-basic-fms-info', BasicFmsInfo);