import { IJsonModel } from 'flexlayout-react';
import { v4 as uuidv4 } from 'uuid';
import editIcon from '/edit.svg';
import settingsIcon from '/settings.svg';

export const appLayoutJson: IJsonModel = {
  global: {
    borderSize: 350,
    tabEnableFloat: false,
    splitterSize: 3,
    splitterExtra: 6,
  },
  borders: [
    {
      type: 'border',
      selected: 1,
      location: 'left',
      children: [
        {
          type: 'tab',
          name: 'Settings',
          component: 'settings',
          enableClose: false,
          enableDrag: false,
          id: 'settingsTab',
          icon: settingsIcon,
        },
        {
          enableRenderOnDemand: true,
          type: 'tab',
          name: 'Editor',
          component: 'editor',
          enableClose: false,
          enableDrag: false,
          id: 'editorTab',
          icon: editIcon,
        },
      ],
    },
  ],
  layout: {
    type: 'row',
    weight: 100,
    id: 'layout',
    children: [
      {
        type: 'tabset',
        weight: 50,
        id: uuidv4(),
        enableTabStrip: false,
        children: [
          {
            type: 'tab',
            component: 'dashboard',
            id: 'dashboard',
          },
        ],
      },
    ],
  },
};
