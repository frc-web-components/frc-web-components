import { axisDashboardConfig } from './axis';
import { barDashboardConfig } from './bar';
import {
  differentialDrivebaseDashboardConfig,
  mecanumDrivebaseDashboardConfig,
  swerveDrivebaseDashboardConfig,
} from './drivebases';
import { iconDashboardConfig } from './icon';
import { threeAxisAccelerometerDashboardConfig } from './3-axis-accelerometer';
import { accelerometerDashboardConfig } from './accelerometer';
import { basicFmsInfoDashboardConfig } from './basic-fms-info';
import { booleanBoxDashboardConfig } from './boolean-box';
import { gaugeDashboardConfig } from './gauge';
import { gyroDashboardConfig } from './gyro';
import { numberBarDashboardConfig } from './number-bar';
import { sendableChooserDashboardConfig } from './sendable-chooser';
import { voltageViewDashboardConfig } from './voltage-view';
import { numberSliderDashboardConfig } from './number-slider';
import { toggleSwitchDashboardConfig } from './toggle-switch';
import { toggleButtonDashboardConfig } from './toggle-button';
import { toggleGroupDashboardConfig } from './toggle-group';
import { relayDashboardConfig } from './relay';
import { encoderDashboardConfig } from './encoder';
import { networkAlertsDashboardConfig } from './network-alerts';
import {
  pidCommandDashboardConfig,
  pidControllerDashboardConfig,
  profiledPidControllerDashboardConfig,
} from './pid';
import { scoringGridDashboardConfig } from './scoring-grid';
import {
  robotCommandDashboardConfig,
  robotSubsystemDashboardConfig,
} from './command-based';
import { WebbitConfig } from '@webbitjs/webbit';

import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export const testComponentDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Test Component',
  },
  properties: {
    stuff: {
      type: 'Object',
      defaultValue: {},
      primary: true,
    },
  },
};

export class TestComponent extends LitElement {
  @property({ type: Object }) stuff = {};

  static styles = css`
    :host {
      display: inline-block;
      width: 200px;
      height: 200px;
      background: green;
    }
  `;

  update(changedProperties: Map<string, any>) {
    console.log('stuff:', this.stuff);
  }

  render(): TemplateResult {
    return html` <div>stuff: ${JSON.stringify(this.stuff)}</div> `;
  }
}

if (!customElements.get('frc-test-component')) {
  customElements.define('frc-test-component', TestComponent);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-test-component': TestComponent;
  }
}

export const dashboardElementConfigs: Record<string, Partial<WebbitConfig>> = {
  'frc-test-component': testComponentDashboardConfig,
  'frc-axis': axisDashboardConfig,
  'frc-bar': barDashboardConfig,
  'frc-differential-drivebase': differentialDrivebaseDashboardConfig,
  'frc-mecanum-drivebase': mecanumDrivebaseDashboardConfig,
  'frc-swerve-drivebase': swerveDrivebaseDashboardConfig,
  'frc-icon': iconDashboardConfig,
  'frc-3-axis-accelerometer': threeAxisAccelerometerDashboardConfig,
  'frc-accelerometer': accelerometerDashboardConfig,
  'frc-basic-fms-info': basicFmsInfoDashboardConfig,
  'frc-boolean-box': booleanBoxDashboardConfig,
  'frc-gauge': gaugeDashboardConfig,
  'frc-gyro': gyroDashboardConfig,
  'frc-number-bar': numberBarDashboardConfig,
  'frc-sendable-chooser': sendableChooserDashboardConfig,
  'frc-voltage-view': voltageViewDashboardConfig,
  'frc-number-slider': numberSliderDashboardConfig,
  'frc-toggle-switch': toggleSwitchDashboardConfig,
  'frc-toggle-button': toggleButtonDashboardConfig,
  'frc-toggle-group': toggleGroupDashboardConfig,
  'frc-relay': relayDashboardConfig,
  'frc-encoder': encoderDashboardConfig,
  'frc-network-alerts': networkAlertsDashboardConfig,
  'frc-pid-command': pidCommandDashboardConfig,
  'frc-pid-controller': pidControllerDashboardConfig,
  'frc-profiled-pid-controller': profiledPidControllerDashboardConfig,
  'frc-scoring-grid': scoringGridDashboardConfig,
  'frc-robot-command': robotCommandDashboardConfig,
  'frc-robot-subsystem': robotSubsystemDashboardConfig,
};
