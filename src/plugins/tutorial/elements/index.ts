import { WebbitConfig } from '@webbitjs/webbit';
import { codeSampleConfig } from './code-sample';

const elementConfigs: Record<string, Partial<WebbitConfig>> = {
  'fwc-code-sample': codeSampleConfig,
};

export default elementConfigs;
