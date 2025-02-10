import { html, svg, css, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import * as d3 from 'd3';
import { WebbitConfig } from '@webbitjs/webbit';

export const swerveDrivebaseDashboardConfig: Partial<WebbitConfig> = {
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

interface SwerveModule {
  location: [number, number];
  desiredRotation: number;
  desiredVelocity: number;
  measuredRotation: number;
  measuredVelocity: number;
}

function hasChangedProp(
  changedProps: Map<string, unknown>,
  ...props: string[]
) {
  return props.some((prop) => changedProps.has(prop));
}

function deg2Rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function rad2Deg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function bound(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min);
}

/**
 *
 * @param angleDeg - top is 0, increases cw. Should be converted to right 0, increases ccw.
 * @returns
 */
function getUnitCircleCords(
  angleDeg: number,
  counterClockwise = false,
): [number, number] {
  const unitAngle = deg2Rad(-(angleDeg - 90));
  const x = counterClockwise ? -Math.cos(unitAngle) : Math.cos(unitAngle);
  return [x, Math.sin(unitAngle)];
}

const MODULE_RADIUS = 35;

export class SwerveDrivebase extends LitElement {
  @property({ type: Number, attribute: 'module-count' }) moduleCount = 4;
  @property({ type: Array, attribute: 'wheel-locations' }) wheelLocations = [
    2.5, 2, 2.5, -2, -2.5, 2, -2.5, -2,
  ];
  @property({ type: Array, attribute: 'measured-states' }) measuredStates = [
    0, 0, 0, 0, 0, 0, 0, 0,
  ];
  @property({ type: Array, attribute: 'desired-states' }) desiredStates = [
    0, 0, 0, 0, 0, 0, 0, 0,
  ];
  @property({ type: Number, attribute: 'robot-rotation' }) robotRotation = 0;

  @property({ type: Number, attribute: 'max-speed' }) maxSpeed = 1;
  @property({ type: String, attribute: 'rotation-unit' }) rotationUnit =
    'radians';

  @property({ type: Number, attribute: 'size-left-right' }) sizeLeftRight = 4;
  @property({ type: Number, attribute: 'size-front-back' }) sizeFrontBack = 5;

  private normalizedRotation = 0;

  // @property({ type: String, attribute: 'forward-direction' }) forwardDirection =
  //   'up';
  // @property({ type: Number, attribute: 'max-angular-velocity' })
  // maxAngularVelocity = Math.PI * 2;
  // @property({ type: Array, attribute: 'measured-chassis-speeds' })
  // measuredChassisSpeeds: number[] = [];
  // @property({ type: Array, attribute: 'desired-chassis-speeds' })
  // desiredChassisSpeeds: number[] = [];

  @query('svg') _svg!: SVGSVGElement;
  @query('.swerve') _swerve!: SVGGElement;
  @query('.base') _base!: SVGRectElement;
  @query('.modules') _modules!: SVGGElement;

  static styles = css`
    :host {
      display: inline-block;
      width: 300px;
      height: auto;
      overflow: visible;
    }

    svg {
      width: 100%;
      overflow: visible;
    }

    .base {
      stroke: var(--frc-swerve-drive-color, black);
    }

    .arrow {
      stroke: var(--frc-swerve-drive-color, black);
    }

    .module-circle {
      stroke: var(--frc-swerve-drive-color, black);
    }
  `;

  drawBase(): void {
    const [width, height] = this.getBaseSize();
    d3.select(this._base)
      .attr('width', width)
      .attr('height', height)
      .attr('stroke-width', 5)
      .attr('fill', 'none');
  }

  setSwerveRotation(): void {
    d3.select(this._swerve).attr(
      'transform',
      `rotate(${-this.normalizedRotation})`,
    );
  }

  setSwerveOrigin(): void {
    const [width, height] = this.getBaseSize();
    d3.select(this._swerve).attr(
      'transform-origin',
      `${width / 2} ${height / 2}`,
    );
  }

  getRobotRotationRad(): number {
    const rotation = this.robotRotation;
    return this.rotationUnit === 'radians' ? rotation : deg2Rad(rotation);
  }

  getSvgSize(): [number, number] {
    const { width } = this.getBoundingClientRect();
    return [width, (width * this.sizeFrontBack) / this.sizeLeftRight];
  }

  getBaseSize(): [number, number] {
    const [width] = this.getSvgSize();
    return [width, (width * this.sizeFrontBack) / this.sizeLeftRight];
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('robotRotation')) {
      const robotRotation = this.robotRotation ?? 0;
      const prevRobotRotation =
        (changedProps.get('robotRotation') as number) ?? robotRotation;
      const rotationChange = prevRobotRotation - robotRotation;
      const rotationChangeDeg =
        this.rotationUnit === 'degrees'
          ? rotationChange
          : rad2Deg(rotationChange);
      const normalizedChange = [
        rotationChangeDeg - 720,
        rotationChangeDeg - 360,
        rotationChangeDeg,
        rotationChangeDeg + 360,
        rotationChangeDeg + 720,
      ];
      let minIndex = 0;
      let minDiff = Math.abs(normalizedChange[0]);
      for (let i = 1; i < normalizedChange.length; i += 1) {
        const diff = Math.abs(normalizedChange[i]);
        if (diff < minDiff) {
          minIndex = i;
          minDiff = diff;
        }
      }
      this.normalizedRotation -= normalizedChange[minIndex];
    }

    if (
      hasChangedProp(
        changedProps,
        'sizeLeftRight',
        'sizeFrontBack',
        'robotRotation',
        'rotationUnit',
      )
    ) {
      this.drawBase();
    }

    if (hasChangedProp(changedProps, 'robotRotation', 'rotationUnit')) {
      this.setSwerveRotation();
    }

    if (hasChangedProp(changedProps, 'sizeLeftRight', 'sizeFrontBack')) {
      this.setSwerveOrigin();
    }
  }

  resized(): void {
    const [width, height] = this.getSvgSize();

    d3.select(this._svg).attr('width', width).attr('height', height);

    this.drawBase();
    this.setSwerveOrigin();
    this.requestUpdate();
  }

  firstUpdated(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.resized();
    });
    resizeObserver.observe(this);
    this.resized();
  }

  getSwerveModules(): SwerveModule[] {
    const modules: SwerveModule[] = [];
    for (let i = 0; i < this.moduleCount; i += 1) {
      const location: [number, number] = [
        this.wheelLocations[i * 2],
        this.wheelLocations[i * 2 + 1],
      ];
      const module: SwerveModule = {
        location,
        desiredRotation: this.desiredStates[i * 2],
        desiredVelocity: this.desiredStates[i * 2 + 1],
        measuredRotation: this.measuredStates[i * 2],
        measuredVelocity: this.measuredStates[i * 2 + 1],
      };
      modules.push(module);
    }
    return modules;
  }

  renderModuleDirectionIndicator(
    clipId: string,
    desiredRotation: number,
    color: string,
  ): TemplateResult {
    const desiredRotDeg =
      this.rotationUnit === 'degrees'
        ? desiredRotation
        : rad2Deg(desiredRotation);
    const [x1, y1] = getUnitCircleCords(desiredRotDeg - 15, true);
    const [x2, y2] = getUnitCircleCords(desiredRotDeg + 15, true);

    const path = `M ${-x1 * 60},${y1 * 60} L 0,0 ${-x2 * 60},${y2 * 60}`;
    return svg`
      <defs>
        <clipPath id=${clipId}>
          <path d=${path} fill="white" stroke="5" stroke="white" />
        </clipPath>
      </defs>
      <circle r=${MODULE_RADIUS - 2.5} fill=${color} stroke-width="0" clip-path=${`url(#${clipId})`}></circle>
    `;
  }

  renderModuleVelocityIndicator(
    id: string,
    rotation: number,
    velocity: number,
    color: string,
  ): TemplateResult {
    const rotationDeg =
      this.rotationUnit === 'degrees' ? rotation : rad2Deg(rotation);

    let arrowLength = bound((100 * velocity) / this.maxSpeed, -100, 100);
    arrowLength += MODULE_RADIUS * Math.sign(arrowLength);
    arrowLength *= -1;

    const y1 = Math.abs(arrowLength) - 20;
    const y2 = Math.abs(arrowLength);
    const arrowHeadPath = `M -17.5,${y1} L 2.5,${y2} L 22.5,${y1}`;

    const transform = `rotate(${-rotationDeg + (arrowLength < 0 ? 180 : 0)})`;
    const maskId = `${id}-velocity`;
    return svg`
     <defs>
        <mask id=${maskId}>
          <circle r="300" fill="white" ></circle>
          <circle r=${MODULE_RADIUS + 2.5} fill="black" ></circle>
        </mask>
      </defs>
      <g class="velocity-indicator" transform=${transform} mask="url(#${maskId})">
        <rect width="5" height=${Math.abs(arrowLength)} fill=${color}></rect>
        <path d=${arrowHeadPath} stroke=${color} stroke-width="5" fill="none" />
      </g>
    `;
  }

  renderModules(): TemplateResult {
    const modules = this.getSwerveModules();
    const [baseWidth, baseHeight] = this.getBaseSize();
    return svg`
      <g class="modules">
        ${modules.map((module, index) => {
          const {
            desiredRotation,
            measuredRotation,
            location,
            measuredVelocity,
            desiredVelocity,
          } = module;
          const y =
            (baseHeight / 2) * (1 - location[0]) +
            MODULE_RADIUS * Math.sign(location[0]);
          const x =
            (baseWidth / 2) * (location[1] + 1) -
            MODULE_RADIUS * Math.sign(location[1]);
          const measuredClipId = `module-${index}-measured-clip`;
          const desiredClipId = `module-${index}-desired-clip`;
          return svg`
            <g transform=${`translate(${x}, ${y})`}>
              <circle class="module-circle" r=${MODULE_RADIUS} stroke-width="5" fill="none"></circle>
              ${this.renderModuleDirectionIndicator(
                measuredClipId,
                measuredRotation,
                'blue',
              )}
              ${this.renderModuleDirectionIndicator(
                desiredClipId,
                desiredRotation,
                'red',
              )}
              ${this.renderModuleVelocityIndicator(
                measuredClipId,
                measuredRotation,
                measuredVelocity,
                'blue',
              )}
              ${this.renderModuleVelocityIndicator(
                desiredClipId,
                desiredRotation,
                desiredVelocity,
                'red',
              )}
            </g>
          `;
        })} 
      </g>
    `;
  }

  renderWheelMask(): TemplateResult {
    const modules = this.getSwerveModules();
    const [baseWidth, baseHeight] = this.getBaseSize();

    return svg`
      <defs>
        <mask id="wheel-mask">
          <rect fill="white" width=${baseWidth} height=${baseHeight} stroke-width="5" stroke="white"></rect>
          ${modules.map((module) => {
            const y =
              baseHeight / 2 -
              (baseHeight * module.location[0]) / this.sizeFrontBack;
            const x =
              baseWidth / 2 -
              (baseWidth * module.location[1]) / this.sizeLeftRight;

            return svg`
              <circle r="50" fill="black" transform=${`translate(${x}, ${y})`}></circle>
            `;
          })}
        </mask>
      </defs>
    `;
  }

  renderArrow(): TemplateResult {
    const [baseWidth, baseHeight] = this.getBaseSize();

    const arrowHeadPath = `M ${baseWidth / 2 - 30},100 L ${baseWidth / 2},70 L ${
      baseWidth / 2 + 30
    },100`;

    return svg`
      <line class="arrow" x1=${baseWidth / 2} y1=${70} x2=${baseWidth / 2} y2=${
        baseHeight - 30
      } stroke-width="5" />
      <path class="arrow" d=${arrowHeadPath} stroke-width="5" fill="none" />
    `;
  }

  render(): TemplateResult {
    return html`
      <div>
        ${svg`
          <svg>
            ${this.renderWheelMask()}
            <g class="swerve">
              <rect class="base" rx=${MODULE_RADIUS}></rect>
              ${this.renderModules()}
              ${this.renderArrow()}
            </g>
          </svg>
      `}
      </div>
    `;
  }
}

if (!customElements.get('frc-swerve-drivebase')) {
  customElements.define('frc-swerve-drivebase', SwerveDrivebase);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-swerve-drivebase': SwerveDrivebase;
  }
}
