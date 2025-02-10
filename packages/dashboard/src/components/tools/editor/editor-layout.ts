import { IJsonModel, IJsonTabSetNode, IJsonTabNode } from 'flexlayout-react';

export const sourceTabJson: IJsonTabNode = {
  type: 'tab',
  enableClose: false,
  enableDrag: false,
  enableFloat: false,
  enableRename: false,
  component: 'sources',
  name: 'Sources',
  id: 'sources',
};

export const componentListTabJson: IJsonTabNode = {
  type: 'tab',
  enableClose: false,
  enableDrag: false,
  enableFloat: false,
  enableRename: false,
  component: 'componentList',
  name: 'Components',
  id: 'componentList',
};

export const propertiesTabJson: IJsonTabNode = {
  type: 'tab',
  enableClose: false,
  enableDrag: false,
  enableFloat: false,
  enableRename: false,
  component: 'properties',
  id: 'mainProperties',
  name: 'Properties',
};

export const toolsTabsetJson: IJsonTabSetNode = {
  id: 'tools',
  enableMaximize: false,
  type: 'tabset',
  weight: 50,
  enableDrag: false,
  children: [sourceTabJson, componentListTabJson],
};

export const propertiesTabsetJson: IJsonTabSetNode = {
  enableMaximize: false,
  type: 'tabset',
  weight: 50,
  id: 'properties',
  enableDrag: false,
  children: [propertiesTabJson],
};

export const editorLayoutJson: IJsonModel = {
  global: {},
  layout: {
    type: 'row',
    children: [
      {
        type: 'row',
        id: 'editor',
        children: [toolsTabsetJson, propertiesTabsetJson],
      },
    ],
  },
};
