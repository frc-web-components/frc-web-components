/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { html, svg, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import * as d3 from 'd3';

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

@customElement('frc-swerve-drivebase')
export class Swerve extends LitElement {
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
  @property({ type: String, attribute: 'forward-direction' }) forwardDirection =
    'up';
  @property({ type: Number, attribute: 'max-angular-velocity' })
  maxAngularVelocity = Math.PI * 2;
  @property({ type: Array, attribute: 'measured-chassis-speeds' })
  measuredChassisSpeeds: number[] = [];
  @property({ type: Array, attribute: 'desired-chassis-speeds' })
  desiredChassisSpeeds: number[] = [];

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
  `;

  drawBase(): void {
    const [width, height] = this.getBaseSize();
    d3.select(this._base)
      .attr('width', width)
      .attr('height', height)
      .attr('stroke-width', 5)
      .attr('stroke', 'white')
      .attr('fill', 'none');
  }

  setSwerveRotation(): void {
    const rotationRad = this.getRobotRotationRad();
    d3.select(this._swerve).attr(
      'transform',
      `rotate(-${rad2Deg(rotationRad)})`
    );
  }

  setSwerveOrigin(): void {
    const [width, height] = this.getBaseSize();
    d3.select(this._swerve).attr(
      'transform-origin',
      `${width / 2} ${height / 2}`
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
    if (
      hasChangedProp(
        changedProps,
        'sizeLeftRight',
        'sizeFrontBack',
        'robotRotation',
        'rotationUnit'
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

  renderModules(): TemplateResult {
    const modules = this.getSwerveModules();
    const [baseWidth, baseHeight] = this.getBaseSize();
    return svg`
      <g class="modules">
        ${modules.map((module) => {
          const y =
            baseHeight / 2 -
            (baseHeight * module.location[0]) / this.sizeFrontBack;
          const x =
            baseWidth / 2 -
            (baseWidth * module.location[1]) / this.sizeLeftRight;

          return svg`
            <g transform=${`translate(${x}, ${y})`}>
              <circle r="50" stroke="white" stroke-width="5" fill="none"></circle>
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

    const arrowHeadPath = `M ${baseWidth / 2 - 30},60 L ${baseWidth / 2},30 L ${
      baseWidth / 2 + 30
    },60`;
    return svg`
      <line x1=${baseWidth / 2} y1=${30} x2=${baseWidth / 2} y2=${
      baseHeight - 30
    } stroke="white" stroke-width="5" />
      <path d=${arrowHeadPath} stroke="white" stroke-width="5" fill="none" />
      
    `;
  }

  render(): TemplateResult {
    return svg`
      <div>
        <svg>
            ${this.renderWheelMask()}
          <g class="swerve">
            <rect class="base" mask="url(#wheel-mask)"></rect>
            ${this.renderModules()}
            ${this.renderArrow()}
          </g>
        </svg>
      </div>
    `;
  }
}
