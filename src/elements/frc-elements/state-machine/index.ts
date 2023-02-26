/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { html, svg, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import * as d3 from 'd3';

export const elementName = 'frc-state-machine';

export const elementConfig = {
  dashboard: {
    displayName: 'State Machine',
  },
  properties: {
    // value: { type: Number, primary: true },
    // hideLabel: { type: Boolean, attribute: 'hide-label' },
    // precision: { type: Number, defaultValue: 2 },
    // counterClockwise: { type: Boolean, attribute: 'counter-clockwise' },
    // fromRadians: { type: Boolean, attribute: 'from-radians' },
  },
};

function getUnitCircleCords(radians: number): [number, number] {
  return [Math.cos(radians), Math.sin(radians)];
}

type Side = 'top' | 'bottom' | 'left' | 'right';

function getRectCenter(rect: DOMRect): [number, number] {
  return [rect.left + rect.width / 2, rect.top + rect.height / 2];
}

function getRectPointFromSide(rect: DOMRect, side: Side): [number, number] {
  const { top, left, width, height } = rect;
  switch (side) {
    case 'top':
      return [left + width / 2, top];
    case 'bottom':
      return [left + width / 2, top + height];
    case 'left':
      return [left, top + height / 2];
    case 'right':
      return [left + width, top + height / 2];
    default:
      return [0, 0];
  }
}

function getDistance(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function getArrowEndpointSides(start: DOMRect, end: DOMRect): [Side, Side] {
  const startCenter = getRectCenter(start);
  const endCenter = getRectCenter(end);

  const startOptions: Side[] = [];
  const endOptions: Side[] = [];

  const combinations: [Side, Side][] = [];

  if (startCenter[0] < endCenter[0]) {
    startOptions.push('right');
    endOptions.push('left');
  } else {
    startOptions.push('left');
    endOptions.push('right');
  }

  if (startCenter[1] < endCenter[1]) {
    startOptions.push('bottom');
    endOptions.push('top');
  } else {
    startOptions.push('top');
    endOptions.push('bottom');
  }

  for (let i = 0; i < 2; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      combinations.push([startOptions[i], endOptions[j]]);
    }
  }

  const combinationDistances: number[] = combinations.map(
    ([startSide, endSide]) => {
      const startPoint = getRectPointFromSide(start, startSide);
      const endPoint = getRectPointFromSide(end, endSide);
      return getDistance(startPoint, endPoint);
    }
  );

  // eslint-disable-next-line no-debugger
  // debugger;

  const minComboIndex = d3.minIndex(combinationDistances);
  return combinations[minComboIndex];
}

function getArrowPointsFromSide(
  containerRect: DOMRect,
  side: Side,
  rect: DOMRect
): { primary: [number, number]; secondary: [number, number] } {
  const primary: [number, number] = getRectPointFromSide(rect, side);
  let secondary: [number, number] = [0, 0];

  if (side === 'left') {
    secondary = [primary[0] - 30, primary[1]];
  } else if (side === 'right') {
    secondary = [primary[0] + 30, primary[1]];
  } else if (side === 'top') {
    secondary = [primary[0], primary[1] - 30];
  } else if (side === 'bottom') {
    secondary = [primary[0], primary[1] + 30];
  }

  primary[0] -= containerRect.left;
  secondary[0] -= containerRect.left;

  primary[1] -= containerRect.top;
  secondary[1] -= containerRect.top;

  return {
    primary,
    secondary,
  };
}

function getArrowCurvePoints(
  containerRect: DOMRect,
  startSide: Side,
  endSide: Side,
  startRect: DOMRect,
  endRect: DOMRect
): [number, number][] {
  const { primary: first, secondary: second } = getArrowPointsFromSide(
    containerRect,
    startSide,
    startRect
  );
  const { primary: fourth, secondary: third } = getArrowPointsFromSide(
    containerRect,
    endSide,
    endRect
  );

  const points: [number, number][] = [first, second, third, fourth];
  return points;
}

function getArrowCurve(points: [number, number][]): [string, string] {
  const curve = d3.line().curve(d3.curveBasis);

  // http://using-d3js.com/05_01_paths.html
  const [, , [x1, y1], [x2, y2]] = points;
  const x = x2 - x1;
  const y = y2 - y1;
  // const xM =  d3.interpolate(x1, x2)(.5);
  const angle = Math.atan(y / x);
  const point2Offset = getUnitCircleCords(angle + Math.PI / 2).map(
    (v) => v * 10
  );
  const point3Offset = getUnitCircleCords(angle - Math.PI / 2).map(
    (v) => v * 10
  );

  const point4Offset = getUnitCircleCords(angle + Math.PI).map((v) => v * 10);
  const [xOffset, yOffset] = [x2 + point4Offset[0], y2 + point4Offset[1]];
  const arrowPoints: [number, number][] = [
    [x2, y2],
    [xOffset + point2Offset[0], yOffset + point2Offset[1]],
    [xOffset + point3Offset[0], yOffset + point3Offset[1]],
    [x2, y2],
  ];
  const arrowHead = d3.line().curve(d3.curveLinear);
  return [curve(points) ?? '', arrowHead(arrowPoints) ?? ''];
}

@customElement('frc-state-machine')
export class StateMachine extends LitElement {
  private stateNames: string[] = ['State 1', 'State 2', 'State 3', 'State 4'];
  private statePositions: number[] = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ].flat();

  private transitionNames = ['Transition 1', 'Transition 2'];
  private transitions = [0, 1, 0, 3];

  @queryAll('.state')
  _states!: HTMLDivElement[];

  @queryAll('.transition')
  _transitions!: SVGPathElement[];

  @queryAll('.transitionHead')
  _transitionHeads!: SVGPathElement[];

  @query('svg')
  _svg!: SVGElement;

  static styles = css`
    :host {
      display: inline-box;
      width: 400px;
      height: 400px;
      overflow: visible;
    }

    svg {
      width: 100%;
      height: 100%;
      overflow: visible;

      position: absolute;
      top: 0;
      left: 0;
    }
  `;

  firstUpdated(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.resized();
    });
    resizeObserver.observe(this);
    this.resized();

    requestAnimationFrame(() => {
      this.#positionStates();
    });
  }

  #positionStates() {
    const [width, height] = this.getSize();
    const containerRect = this.getBoundingClientRect();

    this._svg?.setAttribute('width', width.toString());
    this._svg?.setAttribute('height', height.toString());

    this._states.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const x = this.statePositions[index * 2];
      const y = this.statePositions[index * 2 + 1];

      const xPosition = Math.min(width - rect.width, width * x);
      const yPosition = Math.min(height - rect.height, height * y);
      element.style.setProperty(
        'transform',
        `translate(${xPosition}px, ${yPosition}px)`
      );
    });

    this._transitions.forEach((element, index) => {
      const transitionHead = this._transitionHeads[index];
      const startStateIndex = this.transitions[index * 2];
      const endStateIndex = this.transitions[index * 2 + 1];

      const startState = this._states[startStateIndex];
      const endState = this._states[endStateIndex];

      const startBox = startState.getBoundingClientRect();
      const endBox = endState.getBoundingClientRect();

      const [startSide, endSide] = getArrowEndpointSides(startBox, endBox);

      const curvePoints = getArrowCurvePoints(
        containerRect,
        startSide,
        endSide,
        startBox,
        endBox
      );
      const [arrowCurve, arrowHead] = getArrowCurve(curvePoints);
      // const [, , arrowHeadStart, arrowHeadEnd] = curvePoints;

      element.setAttribute('d', arrowCurve);
      transitionHead.setAttribute('d', arrowHead);
      // element.setAttribute('fill',)
    });

    requestAnimationFrame(() => {
      this.#positionStates();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  resized(): void {
    //
  }

  getSize(): [number, number] {
    const { width, height } = this.getBoundingClientRect();
    return [width, height];
  }

  // eslint-disable-next-line class-methods-use-this
  renderStates(): TemplateResult {
    const [width, height] = this.getSize();

    const states = this.stateNames.map((name, index) => {
      const x = this.statePositions[index * 2];
      const y = this.statePositions[index * 2 + 1];
      const color = d3.schemePastel1[index % 9];

      const styles = `
        position: absolute;
        border-radius: 10px;
        border: 1px solid steelblue;
        padding: 16px;
        transform: translate(${width * x}px, ${height * y}px);
        background: ${color};
      `;

      return html`<div class="state" style=${styles}>${name}</div> `;
    });

    return html`${states}`;
  }

  renderTransitions(): TemplateResult {
    const transitions = this.transitionNames.map((name, index) => {
      const startStateIndex = this.transitions[index * 2];
      const color = d3.schemePastel1[startStateIndex % 9];
      return svg`
        <path id=${`transition${index}`} class="transition" stroke=${color} fill="none" stroke-width="2" />
        <path class="transitionHead" fill=${color} />
        <text fill=${color} text-anchor="middle" dy="-5">
          <textPath href=${`#transition${index}`} startOffset="50%">${name}</textPath>
        </text>
      `;
    });
    return svg`
      ${transitions}
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  render(): TemplateResult {
    return svg`
        <div style="position: relative; width: 100%; height: 100%;">
          ${this.renderStates()}
          <svg>
            ${this.renderTransitions()}
          </svg>
        </div>
    `;
  }
}
