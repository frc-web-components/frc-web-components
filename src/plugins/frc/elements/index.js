import { baseElements } from './base-elements';
import { chartElements } from './chart';
import { commandBasedElements } from './command-based-robot';
import * as controlPanel from './control-panel';
import { drivebaseElements } from './drivebases';
import { fieldElements } from './field';
import { labelElements } from './labels';
import { urdfElements } from './urdf-viewer';
import * as logger from './logger';
import * as threeAxisAccelerometer from './3-axis-accelerometer';
import * as accelerometer from './accelerometer';
import * as basicFmsInfo from './basic-fms-info';
import * as booleanBox from './boolean-box';
import * as camera from './camera';
import * as encoder from './encoder';
import * as gauge from './gauge';
import * as gyro from './gyro';
import * as ifComponent from './if';
import * as numberBar from './number-bar';
import * as pdp from './pdp';
import * as relay from './relay';
import * as voltageView from './voltage-view';

const elements = [
  ...baseElements,
  ...chartElements,
  ...commandBasedElements,
  controlPanel,
  ...drivebaseElements,
  ...fieldElements,
  ...labelElements,
  ...urdfElements,
  logger,
  threeAxisAccelerometer,
  accelerometer,
  basicFmsInfo,
  booleanBox,
  camera,
  encoder,
  gauge,
  gyro,
  ifComponent,
  numberBar,
  pdp,
  relay,
  voltageView,
];

export default Object.fromEntries(
  elements.map(({ elementName, elementConfig }) => [elementName, elementConfig])
);
