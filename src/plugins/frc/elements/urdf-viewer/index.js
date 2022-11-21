import * as urdfViewer from './urdf-viewer';
import { elementConfigs } from './urdf-elements';

export const urdfElements = [
  urdfViewer,
  ...Object.entries(elementConfigs).map(([elementName, elementConfig]) => ({
    elementName,
    elementConfig,
  })),
];
