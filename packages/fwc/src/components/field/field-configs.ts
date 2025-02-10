export interface FieldConfig {
  game: string;
  image: string;
  corners: {
    topLeft: [number, number];
    bottomRight: [number, number];
  };
  size: [number, number];
  unit: string;
}

export const configs: FieldConfig[] = [
  // https://www.chiefdelphi.com/t/4k-field-image-2025-reefscape/478797
  {
    game: 'Reefscape',
    image: './field-images/2025-field.jpg',
    corners: {
      topLeft: [421, 91],
      bottomRight: [3352, 1437],
    },
    size: [57.57291667, 26.4167],
    unit: 'foot',
  },
  // Thanks to MikLast for providing the 2024 field image here:
  // https://www.chiefdelphi.com/t/2024-crescendo-top-down-field-renders/447764
  {
    game: 'Crescendo',
    image: './field-images/2024-field.jpg',
    corners: {
      topLeft: [513, 78],
      bottomRight: [3327, 1475],
    },
    size: [54.265092, 26.31234],
    unit: 'foot',
  },
  {
    game: 'Charged Up',
    image: './field-images/2023-field.jpg',
    corners: {
      topLeft: [46, 36],
      bottomRight: [1088, 544],
    },
    size: [54.27083, 26.2916],
    unit: 'foot',
  },
  {
    game: 'Rapid React',
    image: './field-images/2022-field.jpg',
    corners: {
      topLeft: [74, 50],
      bottomRight: [1774, 900],
    },
    size: [54, 27],
    unit: 'foot',
  },
  {
    game: 'Infinite Recharge',
    image: './field-images/2020-field.jpg',
    corners: {
      topLeft: [96, 25],
      bottomRight: [1040, 514],
    },
    size: [52.4375, 26.9375],
    unit: 'foot',
  },
  {
    game: 'Destination: Deep Space',
    image: './field-images/2019-field.jpg',
    corners: {
      topLeft: [217, 40],
      bottomRight: [1372, 615],
    },
    size: [54, 27],
    unit: 'foot',
  },
  {
    game: 'FIRST Power Up',
    image: './field-images/2018-field.jpg',
    corners: {
      topLeft: [125, 20],
      bottomRight: [827, 370],
    },
    size: [54, 27],
    unit: 'feet',
  },
  {
    game: 'Barrel Racing Path',
    image: './field-images/2021-barrel.png',
    corners: {
      topLeft: [20, 20],
      bottomRight: [780, 400],
    },
    size: [30, 15],
    unit: 'feet',
  },
  {
    game: 'Bounce Path',
    image: './field-images/2021-bounce.png',
    corners: {
      topLeft: [20, 20],
      bottomRight: [780, 400],
    },
    size: [30, 15],
    unit: 'feet',
  },
  {
    game: 'Galactic Search A',
    image: './field-images/2021-galacticsearcha.png',
    corners: {
      topLeft: [20, 20],
      bottomRight: [780, 400],
    },
    size: [30, 15],
    unit: 'feet',
  },
  {
    game: 'Galactic Search B',
    image: './field-images/2021-galacticsearchb.png',
    corners: {
      topLeft: [20, 20],
      bottomRight: [780, 400],
    },
    size: [30, 15],
    unit: 'feet',
  },
  {
    game: 'Slalom Path',
    image: './field-images/2021-slalom.png',
    corners: {
      topLeft: [20, 20],
      bottomRight: [780, 400],
    },
    size: [30, 15],
    unit: 'feet',
  },
];

export default configs;
