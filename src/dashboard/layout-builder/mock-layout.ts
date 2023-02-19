// interface TabMetadata {
//   [tabNames: string]: {
//     [componentName: string]: {
//       PreferredComponent: string;
//       Size: [number, number];
//       Position: [number, number];
//     };
//   };
// }

// interface TabNames {
//   Tabs: string[];
// }

// type Metadata = TabNames | (TabMetadata & TabNames);

// const a: Metadata = {
//   Tabs: ['a', 'b'],
//   a: {
//     b: {
//       PreferredComponent: 'bleh',
//       Size: [1, 2],
//       Position: [1, 3],
//     },
//   },
// };

// interface WidgetConfig {
//   '.controllable'?: boolean;
//   '.type': string;
//   '.actuator'?: boolean;
//   [propertyName: string]: any;
// }

// type TabConfig = { '.type': 'ShuffleboardTab' } & {
//   [widgetName: string]: WidgetConfig | number | string;
// };

// interface TabConfigs {
//   [tabName: string]: TabConfig;
// }

// type Layout = TabConfigs & {
//   '.metadata': Metadata;
// };

interface Metadata {
  tabNames: string[];
  tabs: {
    [tabName: string]: {
      components: {
        [componentName: string]: {
          preferredComponent: string;
          size: [number, number];
          position: [number, number];
        };
      };
    };
  };
}

type ComponentData =
  | number
  | string
  | boolean
  | {
      controllable: boolean;
      type: string;
      actuator: boolean;
      properties: {
        [name: string]: unknown;
      };
    };

interface Layout {
  metadata: Metadata;
  tabData: {
    [tabName: string]: {
      componentData: {
        [componentName: string]: ComponentData;
      };
    };
  };
}

const layout = {
  '.metadata': {
    Tabs: ['Configuration', 'Drivebase', 'Elevator'],
    Configuration: {
      'Max Speed': {
        PreferredComponent: 'Number Slider',
        Size: [2, 1],
        Position: [1, 1],
      },
    },
    Drivebase: {
      'List Layout': {
        PreferredComponent: 'Encoders',
        Size: [2, 2],
        Position: [0, 0],
      },
    },
  },
  Configuration: {
    '.type': 'ShuffleboardTab',
    'Max Speed': 1,
  },
  Drivebase: {
    '.type': 'ShuffleboardTab',
    'Tank Drive': {
      '.controllable': true,
      '.type': 'DifferentialDrive',
      '.actuator': true,
      'Left Motor Speed': 1,
      'Right Motor Speed': -0.11800000071525574,
    },
    'List Layout': {
      '.type': 'ShuffleboardLayout',
      'Left Encoder': {
        '.controllable': true,
        '.type': 'Quadrature Encoder',
        Speed: 5.562684646268003e-309,
        Distance: 0,
        'Distance per Tick': 1,
      },
      'Right Encoder': {
        '.controllable': true,
        '.type': 'Quadrature Encoder',
        Speed: 5.562684646268003e-309,
        Distance: 0,
        'Distance per Tick': 1,
      },
    },
  },
  Elevator: {
    '.type': 'ShuffleboardTab',
    Motor: {
      '.controllable': true,
      '.type': 'Motor Controller',
      '.actuator': true,
      Value: 0,
    },
    Potentiometer: {
      '.controllable': true,
      '.type': 'Analog Input',
      Value: 0,
    },
  },
};

export default layout;
