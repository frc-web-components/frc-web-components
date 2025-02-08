import { ComponentConfig } from '@/dashboard';
import { robotState } from './RobotState';
import { addressableLEDs } from './AddressableLEDs';

export const simComponents: Record<string, ComponentConfig> = {
  addressableLEDs,
  robotState,
};
