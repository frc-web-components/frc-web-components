import { IJsonModel } from 'flexlayout-react';
import { v4 as uuidv4 } from 'uuid';

export const layoutJson: IJsonModel = {
  global: {
    borderSize: 350,
    tabEnableFloat: false,
    splitterSize: 3,
    splitterExtra: 6,
  },
  layout: {
    type: 'row',
    weight: 100,
    id: 'layout',
    children: [
      {
        type: 'tabset',
        weight: 50,
        id: uuidv4(),
        children: [
          {
            type: 'tab',
            name: 'TeleOperated',
            component: 'components',
            id: uuidv4(),
          },
          {
            type: 'tab',
            name: 'Autonomous',
            component: 'components',
            id: uuidv4(),
          },
        ],
      },
    ],
  },
};
