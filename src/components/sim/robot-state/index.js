import { html, css } from '@webbitjs/webbit';
import Container from '../../container';

class RobotState extends Container {

  static get metadata() {
    return {
      displayName: 'Robot State',
      category: 'Simulation',
      //description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/relay/'
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        [part=connection] {
          color: red;
        }

        [part=connection].connected {
          color: green;
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
      ...super.properties,
      enabled: { type: Boolean },
      autonomous: { type: Boolean },
      test: { type: Boolean },
      ds: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.display = 'inline-block';
    this.fontFamily = 'sans-serif';
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
      <p part="connection" class="${this.ds ? 'connected' : ''}">
        ${this.ds ? 'Connected!' : 'Disconnected!'}
      </p>
    `;
  }
}

webbitRegistry.define('frc-robot-state', RobotState);