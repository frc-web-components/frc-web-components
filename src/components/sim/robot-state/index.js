import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

class RobotState extends Webbit {

  static get metadata() {
    return {
      displayName: 'Robot State',
      category: 'Simulation',
      slots: [],
      //description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/relay/'
      resizable: {},
    };
  }

  static get styles() {
    return [
      containerStyles,
      css`
        :host {
          display: inline-block;
          font-family: sans-serif;
        }

        [part=header] {
          display: block;
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 7px;
          color: #555;
        }

        vaadin-radio-group {
          padding-top: 0;
        }

        p {
          margin: 5px 0;
        }
      `
    ];
  }

  static get properties() {
    return {
      enabled: { type: Boolean },
      autonomous: { type: Boolean },
      test: { type: Boolean }
    };
  }

  constructor() {
    super();

    this.sourceKey = 'driverStation';
    this.sourceProvider = 'HALSim';
    
    this.enabled = false;
    this.autonomous = false;
    this.test = false;
    this.ds = false;
  }

  isDisabled() {
    return !this.enabled;
  }

  isAutonomous() {
    return this.enabled && this.autonomous && !this.test;
  }

  isTeleop() {
    return this.enabled && !this.autonomous && !this.test;
  }

  isTest() {
    return this.enabled && !this.autonomous && this.test;
  }

  onChange(ev) {
    const target = ev.target || ev.path[0];
    const value = target.value;

    if (value === 'disabled') {
      this.enabled = false;
    } else if (value === 'auto') {
      this.enabled = true;
      this.autonomous = true;
      this.test = false;
    } else if (value === 'teleop') {
      this.enabled = true;
      this.autonomous = false;
      this.test = false;
    } else if (value === 'test') {
      this.enabled = true;
      this.autonomous = false;
      this.test = true;
    }
  }

  render() {
    return html`   
      <label part="header">Robot State</label>
      <vaadin-radio-group 
        theme="vertical"
        @value-changed="${this.onChange}"
      >
        <vaadin-radio-button value="disabled" ?checked="${this.isDisabled()}">
          Disabled
        </vaadin-radio-button>
        <vaadin-radio-button value="auto" ?checked="${this.isAutonomous()}" >
          Autonomous
        </vaadin-radio-button>
        <vaadin-radio-button value="teleop" ?checked="${this.isTeleop()}">
          Teleoperated
        </vaadin-radio-button>
        <vaadin-radio-button value="test" ?checked="${this.isTest()}">
          Test
        </vaadin-radio-button>
      </vaadin-radio-group>
    `;
  }
}

webbitRegistry.define('frc-sim-robot-state', RobotState);