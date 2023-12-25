import { ObjectConfig } from './field-interfaces';

export const configs: ObjectConfig[] = [
  {
    name: 'KitBot',
    src: '/3d-models/Robot_KitBot.glb',
    rotations: [{ axis: 'z', degrees: 90 }],
    position: [0.12, 3.15, 0],
  },
  {
    name: 'Duck Bot',
    src: '/3d-models/Robot_Duck Bot.glb',
    rotations: [{ axis: 'z', degrees: 90 }],
    position: [0, 0, 0],
  },
  {
    name: 'Crab Bot',
    src: '/3d-models/Robot_Crab Bot.glb',
    rotations: [
      {
        axis: 'z',
        degrees: 180,
      },
    ],
    position: [0, 0, 0.045],
  },
  {
    name: 'Bot-Bot Awakens (6328)',
    src: '/3d-models/Robot_Bot-Bot Awakens (6328).glb',
    rotations: [
      { axis: 'z', degrees: 90 },
      { axis: 'y', degrees: 90 },
    ],
    position: [0, 0, 0],
  },
  {
    name: 'Bot-Bot Strikes Back (6328)',
    src: '/3d-models/Robot_Bot-Bot Strikes Back (6328).glb',
    rotations: [
      { axis: 'x', degrees: 90 },
      { axis: 'z', degrees: 90 },
    ],
    position: [0.05, 0, 0.06],
  },
  {
    name: 'REV 2023 Starter Bot',
    src: '/3d-models/Robot_REV 2023 Starter Bot.glb',
    rotations: [
      {
        axis: 'x',
        degrees: 90,
      },
      {
        axis: 'z',
        degrees: 90,
      },
    ],
    position: [0, 0, 0],
    components: [
      {
        name: '0',
        src: '/3d-models/Robot_REV 2023 Starter Bot_0.glb',
        rotations: [
          {
            axis: 'x',
            degrees: 90,
          },
          {
            axis: 'z',
            degrees: 90,
          },
          {
            axis: 'y',
            degrees: 211,
          },
        ],
        position: [0.645, 0, 0.48],
      },
      {
        name: '1',
        src: '/3d-models/Robot_REV 2023 Starter Bot_1.glb',
        rotations: [
          {
            axis: 'x',
            degrees: 90,
          },
          {
            axis: 'z',
            degrees: 90,
          },
        ],
        position: [0.305, 0, -0.37],
      },
    ],
  },
];

export default configs;
