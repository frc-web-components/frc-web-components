import { Layout } from '../store/slices/layoutSlice';

const layout: Layout = {
  flexLayout: {
    global: { splitterSize: 3, splitterExtra: 6, borderSize: 350 },
    borders: [],
    layout: {
      type: 'row',
      id: 'layout',
      children: [
        {
          type: 'tabset',
          id: '3ac4a063-f076-47da-a388-1319a9f483b4',
          weight: 50,
          children: [
            {
              type: 'tab',
              id: '624aa1f6-4b6d-4925-8219-d3a4a401b02b',
              name: 'TeleOperated',
              component: 'components',
            },
            {
              type: 'tab',
              id: 'c5e6b1ed-33dc-4373-b453-9ce418472b27',
              name: 'Autonomous',
              component: 'components',
            },
          ],
          active: true,
        },
      ],
    },
  },
  components: {
    '83588f84-010c-4c18-9aa4-bdf098344ad7': {
      id: '83588f84-010c-4c18-9aa4-bdf098344ad7',
      children: [],
      source: { key: '/SmartDashboard/swerve', provider: 'NT' },
      minSize: { width: 4, height: 4 },
      size: { width: 6, height: 6 },
      position: { x: 2, y: 2 },
      properties: {
        measuredStates: { value: [0, 0, 0, 0, 0, 0, 0, 0] },
        desiredStates: { value: [0, 0, 0, 0, 0, 0, 0, 0] },
        robotRotation: { value: 0 },
        maxSpeed: { value: 1 },
        rotationUnit: { value: 'radians' },
        sizeLeftRight: { value: 2 },
        sizeFrontBack: { value: 2 },
      },
      type: 'swerveDrivebase',
      name: 'Swerve Drivebase',
    },
    '62c17d6c-7d70-4262-8483-75d18193b021': {
      id: '62c17d6c-7d70-4262-8483-75d18193b021',
      children: [],
      minSize: { width: 1, height: 1 },
      size: { width: 5, height: 8 },
      position: { x: 10, y: 1 },
      properties: {
        markdown: {
          value:
            'The <span style="color: blue; font-weight: bold">BLUE</span> lines are the measured velocity and position of the swerve module.\n\nThe <span style="color: red; font-weight: bold">RED</span> lines is the velocity and position of the module sent!',
        },
      },
      type: 'markdownViewer',
      name: 'Markdown Viewer',
    },
  },
  tabs: {
    '624aa1f6-4b6d-4925-8219-d3a4a401b02b': {
      componentIds: [
        '83588f84-010c-4c18-9aa4-bdf098344ad7',
        '62c17d6c-7d70-4262-8483-75d18193b021',
      ],
    },
  },
  gridSize: 50,
  gridGap: 5,
  gridPadding: 5,
};

export default layout;
