import { LitElement, html, css } from 'lit-element';

const ENABLED_FLAG = 0x01;
const AUTO_FLAG = 0x02;
const TEST_FLAG = 0x04;
const EMERGENCY_STOP_FLAG = 0x08;
const FMS_ATTACHED_FLAG = 0x10;
const DS_ATTACHED_FLAG = 0x20;

const MATCH_TYPES = ['Unknown', 'Practice', 'Qualification', 'Elimination'];

 /**
 * Component for displaying data from the FMS
 *
 * @attr {Number} match-type - The match type encoded as a number. 0 = Unknown, 1 = Practice, 2 = Qualification, 3 = Elimination
 * @attr {Number} match-number - The competition match number
 * @attr {String} event-name - The name of the event
 * @attr {Number} fms-control-data - A number used to encode control data from the FMS, such as the robot state, if the robot is emergency stopped, and if the FMS and DS are attached.
 */
class BasicFmsInfo extends LitElement {

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
      matchType: { type: Number, attribute: 'match-type', reflect: true },
      matchNumber: { type: Number, attribute: 'match-number', reflect: true },
      eventName: { type: String, attribute: 'event-name', reflect: true },
      fmsControlData: { type: Number, attribute: 'fms-control-data', reflect: true },
    };
  }

  get fmsControlData() {
    return this._fmsControlData || 0;
  }

  set fmsControlData(value) {
    const oldValue = this._fmsControlData;
    this._fmsControlData = value;
    this.requestUpdate('fmsControlData', oldValue);
  }

  constructor() {
    super();
    this.matchType = 0;
    this.matchNumber = 0;
    this.eventName = '';
    this.fmsControlData = 0;
    this.sourceKey = '/fmsInfo';
    this.sourceProvider = 'NetworkTables';
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
          <span>${this.eventName || ''}</span>
          <span>${MATCH_TYPES[this.matchType || 0]}</span>
          <span>match ${this.matchNumber || 0}</span>
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

customElements.define('frc-basic-fms-info', BasicFmsInfo);

webbitRegistry.addExisting('frc-basic-fms-info', {
  displayName: 'Basic FMS Info',
  category: 'Robot & Field Info',
  description: 'Component for displaying data from the FMS',
  documentationLink: 'https://frc-web-components.github.io/components/basic-fms-info/',
  slots: [],
  defaultSourceKey: '/fmsInfo',
  defaultSourceProvider: 'NetworkTables',
  properties: {
    matchType: { type: Number, defaultValue: 0 },
    matchNumber: { type: Number, defaultValue: 0 },
    eventName: { type: String, defaultValue: '' },
    fmsControlData: { type: Number, defaultValue: 0 },
  }
});
