export default {
  dashboard: {
    displayName: 'Swerve Drivebase',
  },
  properties: {
    moduleCount: {
      type: 'Number',
      defaultValue: 4,
      description: 'The number of swerve modules',
    },
    wheelLocations: {
      type: 'Array',
      defaultValue: [1, -1, 1, 1, -1, -1, -1, 1],
      description:
        'An array of numbers describing the location of the swerve module wheels relative to the physical center of the robot',
    },
    measuredStates: {
      type: 'Array',
      defaultValue: [0, 0, 0, 0, 0, 0, 0, 0],
      description:
        'An array of rotation and velocity values describing the measured state of each swerve module',
    },
    desiredStates: {
      type: 'Array',
      defaultValue: [0, 0, 0, 0, 0, 0, 0, 0],
      description:
        'An array of rotation and velocity values describing the desired state of each swerve module',
    },
    robotRotation: {
      type: 'Number',
      description: `The robot's current rotation based on odometry or gyro readings`,
    },
    maxSpeed: {
      type: 'Number',
      defaultValue: 1,
      description:
        'The maximum achievable speed of the modules, used to adjust the size of the vectors.',
    },
    rotationUnit: {
      type: 'String',
      defaultValue: 'radians',
      description: 'The units of the module rotations and robot rotation',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions(): string[] {
          return ['radians', 'degrees'];
        },
      },
    },
    sizeLeftRight: {
      type: 'Number',
      defaultValue: 2,
      description: 'The distance between the left and right modules.',
    },
    sizeFrontBack: {
      type: 'Number',
      defaultValue: 2,
      description: 'The distance between the front and back modules.',
    },
    // forwardDirection: {
    //   type: 'String',
    //   defaultValue: 'up',
    //   description:
    //     'The direction the robot should be facing when the "Robot Rotation" is zero or blank. This option is often useful to align with odometry data or match videos.',
    //   input: {
    //     type: 'StringDropdown',
    //     allowCustomValues: false,
    //     getOptions(): string[] {
    //       return ['up', 'right', 'down', 'left'];
    //     },
    //   },
    // },
    // maxAngularVelocity: {
    //   type: 'Number',
    //   defaultValue: Math.PI * 2,
    //   description:
    //     'The maximum achievable angular velocity of the robot. This is used to visualize the angular velocity from the chassis speeds properties.',
    // },
    // measuredChassisSpeeds: {
    //   type: 'Array',
    //   description:
    //     'Describes the measured forward, sideways and angular velocity of the robot',
    // },
    // desiredChassisSpeeds: {
    //   type: 'Array',
    //   description:
    //     'Describes the desired forward, sideways and angular velocity of the robot',
    // },
  },
};
